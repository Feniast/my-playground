import {
  unstable_IdlePriority as idlePriority,
  unstable_runWithPriority as run
} from 'scheduler';
import { capitalize } from '../util';
import { getTypeDefinition } from '../toneType';
import {
  APPEND_CHILD,
  REMOVE_CHILD,
  INSERT_BEFORE,
  INSTRUMENT,
  TONE_CLASS,
  EFFECT,
  EVENT
} from '../constants';
import {
  applyProps,
  attachChild,
  detachChild,
  connectChild,
  disconnectChild
} from './relations';
import { isFunction } from 'util';
import Tone from '../Tone';

const isTrigger = str =>
  ['triggerAttack', 'triggerRelease', 'triggerAttackRelease'].includes(str);

class Root {
  [APPEND_CHILD](child) {
    child.parent = this;
    connectChild(null, child);
  }

  [REMOVE_CHILD](child) {
    child.parent = undefined;
    disconnectChild(null, child);
  }
}

export const createRoot = () => {
  return new Root();
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

const baseDecorator = {
  [APPEND_CHILD](child) {
    child.parent = this;
    attachChild(this, child);
  },
  [REMOVE_CHILD](child) {
    child.parent = undefined;
    detachChild(this, child);
  }
};

const effectDecorator = {
  [APPEND_CHILD](child) {
    child.parent = this;
    attachChild(this, child);
    connectChild(this, child);
  },
  [REMOVE_CHILD](child) {
    child.parent = undefined;
    detachChild(this, child);
    disconnectChild(this, child);
  }
};

const decorate = (type, instance) => {
  switch (type) {
    case INSTRUMENT:
      Object.assign(instance, baseDecorator);
      break;
    case EFFECT:
      Object.assign(instance, effectDecorator);
      break;
    default:
      break;
  }
};

const processEventInstance = (instance, props) => {
  const { noTrigger = false } = props;
  if (noTrigger === true) return;
  const callback = instance.callback;
  if (callback.__wrapped) return;
  const wrappedCallback = (...args) => {
    if (instance.parent && instance.parent instanceof Tone.Instrument) {
      if (isFunction(callback)) callback(instance.parent, ...args);
    }
  }
  wrappedCallback.__wrapped = true;
  instance.callback = wrappedCallback;
}

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
    instance[TONE_CLASS] = toneClass;
    applyProps(instance, rest);
    if (toneClass === EVENT) {
      processEventInstance(instance, props);
    }
    decorate(toneClass, instance);
    return instance;
  } else if (isTrigger(type)) {
    const { args = [] } = props;
    const instance = {
      isTrigger: true,
      execute() {
        if (this.parent) {
          this.parent[type](...args);
        }
      }
    };
    return instance;
  }
  return null;
};
