import {
  unstable_IdlePriority as idlePriority,
  unstable_runWithPriority as run
} from 'scheduler';
import Tone from 'tone';
import { capitalize, isArray, isObject } from '../util';
import { getTypeDefinition } from '../toneType';
import {
  APPEND_CHILD,
  REMOVE_CHILD,
  INSERT_BEFORE,
  INSTRUMENT,
  TONE_CLASS,
  EFFECT,
  EVENT,
  ON_UPDATE,
  ON_RENDER,
  PARENT,
  CHILDREN
} from '../constants';
import {
  applyProps,
  attachChild,
  detachChild,
  connectChild,
  disconnectChild,
  linkChild,
  unlinkChild,
  updateToneEvents
} from './host';
import { isFunction } from 'util';

const isTrigger = str =>
  ['triggerAttack', 'triggerRelease', 'triggerAttackRelease'].includes(str);

const defineNodeDecorator = (options = {}) => {
  const {
    appendChildOps = [],
    removeChildOps = [],
    insertAsAppend = true,
    insertBeforeOps = []
  } = options;
  const decorator = {
    [APPEND_CHILD](child) {
      appendChildOps.forEach(fn => fn(this, child));
    },
    [REMOVE_CHILD](child) {
      removeChildOps.forEach(fn => fn(this, child));
      run(idlePriority, () => {
        if (child[CHILDREN]) {
          child[CHILDREN].forEach(c => removeChild(child, c));
        }
        if (child.dispose) {
          child.dispose();
        }
        delete child[CHILDREN];
      });
    },
    [INSERT_BEFORE]: insertAsAppend
      ? function(child) {
          this[APPEND_CHILD](child);
        }
      : function(child, before) {
          insertBeforeOps.forEach(fn => fn(child, before));
        }
  };
  return instance => {
    return Object.assign(instance, decorator);
  };
};

export const appendChild = (parent, child) => {
  if (!parent || !child) return;
  parent[APPEND_CHILD](child);
};

export const removeChild = (parent, child) => {
  if (!parent || !child) return;
  parent[REMOVE_CHILD](child);
};

export const insertBefore = (parent, child, before) => {
  if (!parent || !child) return;
  parent[INSERT_BEFORE](child, before);
};

const defineRoot = defineNodeDecorator({
  appendChildOps: [linkChild, connectChild],
  removeChildOps: [unlinkChild, disconnectChild]
});

export const createRoot = () => {
  return defineRoot({});
};

const decorateInstrument = defineNodeDecorator({
  appendChildOps: [linkChild, attachChild],
  removeChildOps: [unlinkChild, detachChild]
});

const decorateEffect = defineNodeDecorator({
  appendChildOps: [linkChild, attachChild, connectChild],
  removeChildOps: [unlinkChild, detachChild, disconnectChild]
});

const decorate = (type, instance) => {
  switch (type) {
    case INSTRUMENT:
      decorateInstrument(instance);
      break;
    case EFFECT:
      decorateEffect(instance);
      break;
    default:
      break;
  }
};

const CREATE_INSTANCE_HOOKS = {
  [INSTRUMENT]: {},
  [EVENT]: {
    ignoredProps: ['start', 'stop', 'wrapCallback'],
    afterApplyProps: (instance, type, props, oldProps) => {
      const { wrapCallback = true } = props;
      if (wrapCallback === false) return;
      const callback = instance.callback;
      if (callback.__wrapped) return;
      const wrappedCallback = (...args) => {
        if (instance[PARENT] && instance[PARENT] instanceof Tone.Instrument) {
          if (isFunction(callback)) callback(instance[PARENT], ...args);
        }
      };
      wrappedCallback.__wrapped = true;
      instance.callback = wrappedCallback;
      instance[ON_RENDER] = () => {
        const state = instance.state;
        if (state === 'started') {
          if (!props.start) {
            instance.stop();
          }
        } else {
          if (props.start) {
            if (isArray(props.start)) {
              instance.start(...props.start);
            } else {
              instance.start();
            }
          }
        }
      };
    }
  }
};

export const createInstance = (
  type,
  props,
  rootContainerInstance,
  currentHostContext,
  workInProgress
) => {
  const name = capitalize(type);
  const typeDef = getTypeDefinition(name);
  if (typeDef) {
    const { type: toneClass, constructor: Target } = typeDef;
    const { args = [], ...rest } = props;
    let instance = new Target(...args);
    const hookObj = CREATE_INSTANCE_HOOKS[toneClass] || {};
    instance[TONE_CLASS] = toneClass;
    if (isFunction(hookObj.beforeApplyProps)) {
      hookObj.beforeApplyProps(instance, type, props, {});
    }
    applyProps(instance, rest, {}, hookObj.ignoredProps);
    if (isFunction(hookObj.afterApplyProps)) {
      hookObj.afterApplyProps(instance, type, props, {});
    }
    decorate(toneClass, instance);
    return instance;
  } else if (isTrigger(type)) {
    const { args = [] } = props;
    const instance = {
      isTrigger: true,
      [ON_RENDER]() {
        if (this[PARENT]) {
          this[PARENT][type](...args);
        }
      }
    };
    return instance;
  }
  return null;
};

const switchInstance = (instance, type, newProps, fiber) => {
  const parent = instance[PARENT];
  const newInstance = createInstance(type, newProps);
  removeChild(parent, instance);
  appendChild(parent, newInstance);

  // This evil hack switches the react-internal fiber node
  // https://github.com/facebook/react/issues/14983
  // https://github.com/facebook/react/pull/15021
  [fiber, fiber.alternate].forEach(fiber => {
    if (fiber !== null) {
      fiber.stateNode = newInstance;
      if (fiber.ref) {
        if (typeof fiber.ref === 'function') fiber.ref(newInstance);
        else fiber.ref.current = newInstance;
      }
    }
  });
};

const updateProps = (instance, type, oldProps, newProps) => {
  const toneClass = instance[TONE_CLASS];
  const hookObj = CREATE_INSTANCE_HOOKS[toneClass] || {};
  if (isFunction(hookObj.beforeApplyProps)) {
    hookObj.beforeApplyProps(instance, type, newProps, oldProps);
  }
  applyProps(instance, newProps, oldProps, hookObj.ignoredProps);
  if (isFunction(hookObj.afterApplyProps)) {
    hookObj.afterApplyProps(instance, type, newProps, oldProps);
  }
};

export const commitUpdate = (
  instance,
  updatePayload,
  type,
  oldProps,
  newProps,
  fiber
) => {
  const { args: argsNew = [], ...restNew } = newProps;
  const { args: argsOld = [], ...restOld } = oldProps;
  // There are some special case for tone sequence and part
  if (instance instanceof Tone.Sequence) {
    // check whether subdivision is equal, if not, create a new instance
    if (argsNew[2] !== argsOld[2]) {
      switchInstance(instance, type, newProps, fiber);
    } else {
      if (argsNew[0] !== argsOld[0]) {
        console.log('update callback');
        instance.callback = argsNew[0];
      }
      updateToneEvents(instance, argsNew[1], argsOld[1]);
      updateProps(instance, type, restNew, restOld);
    }
  } else if (instance instanceof Tone.Part) {
    if (argsNew[0] !== argsOld[0]) {
      console.log('update callback');
      instance.callback = argsNew[0];
    }
    updateToneEvents(instance, argsNew[1], argsOld[1]);
    updateProps(instance, type, restNew, restOld);
  } else {  // If it has new props or arguments, then it needs to be re-instanciated
    const hasNewArgs = argsNew.some((value, index) =>
      isObject(value)
        ? Object.entries(value).some(
            ([key, val]) => val !== argsOld[index][key]
          )
        : value !== argsOld[index]
    );
    if (hasNewArgs || !instance[TONE_CLASS]) {
      // Next we create a new instance and append it again
      switchInstance(instance, type, newProps, fiber);
    } else {
      // Otherwise just overwrite props
      updateProps(instance, type, restNew, restOld);
    }
  }
};
