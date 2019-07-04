import {
  unstable_IdlePriority as idlePriority,
  unstable_runWithPriority as run
} from 'scheduler';
import Tone from 'tone';
import { capitalize } from '../util';
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
  unlinkChild
} from './host';
import { isFunction } from 'util';

const isTrigger = str =>
  ['triggerAttack', 'triggerRelease', 'triggerAttackRelease'].includes(str);

const defineInstanceNodeDecorator = (options = {}) => {
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
          console.log('dispose', child);
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

const defineRoot = defineInstanceNodeDecorator({
  appendChildOps: [linkChild, connectChild],
  removeChildOps: [unlinkChild, disconnectChild]
});

export const createRoot = () => {
  return defineRoot({});
};

const decorateInstrument = defineInstanceNodeDecorator({
  appendChildOps: [linkChild, attachChild],
  removeChildOps: [unlinkChild, detachChild]
});

const decorateEffect = defineInstanceNodeDecorator({
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
    afterApplyProps: (instance, type, props) => {
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
        instance.start();
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
      hookObj.beforeApplyProps(instance, type, props);
    }
    applyProps(instance, rest);
    if (isFunction(hookObj.afterApplyProps)) {
      hookObj.afterApplyProps(instance, type, props);
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
