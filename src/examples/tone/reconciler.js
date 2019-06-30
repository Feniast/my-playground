import React from 'react';
import Reconciler from 'react-reconciler';
import {
  unstable_scheduleCallback as scheduleDeferredCallback,
  unstable_cancelCallback as cancelDeferredCallback,
  unstable_now as now,
  unstable_IdlePriority as idlePriority,
  unstable_runWithPriority as run
} from 'scheduler';
import Tone from 'tone';

const TONE_CLASS = '__toneClass';
const INSTRUMENT = 'Instrument';

const roots = new Map();

const ignoredProps = ['children', 'key', 'ref'];

const emptyObject = Object.create(null);

const capitalize = str => {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
};

const hasValueKey = o =>
  o && typeof o === 'object' && o.hasOwnProperty('value');

const getDeepValue = (o = {}, keys = []) =>
  keys.reduce((v, k) => {
    if (v) return v[k];
    return undefined;
  }, o);

const isTrigger = (str) => ['triggerAttack', 'triggerRelease', 'triggerAttackRelease'].includes(str);

const ToneTypeMap = {
  [INSTRUMENT]: {
    internal: ['Synth', 'AMSynth'],
    custom: []
  }
};

const getTypeDefinition = type => {
  const keys = Object.keys(ToneTypeMap);
  for (let k of keys) {
    const { internal, custom } = ToneTypeMap[k];
    if (internal.indexOf(type) >= 0)
      return {
        type: k,
        constructor: Tone[type]
      };
    const def = custom.find(({ name }) => name === type);
    if (def) {
      return {
        type: k,
        constructor: def.constructor
      };
    }
  }
  return null;
};

export const registerType = (type, name, constructor) => {
  if (!ToneTypeMap[type]) return;
  ToneTypeMap[type].custom.push({
    name,
    constructor
  });

  return () => {
    ToneTypeMap[type].custom = ToneTypeMap[type].custom.filter(
      o => o.name !== name
    );
  };
};

const instrumentDecorator = (instance) => {
  return instance;
}

const decorateInstance = (instance, type, props) => {
  instance[TONE_CLASS] = type;
  if (type === 'Instrument') {
    // TODO: make it to master for now
    instance.toMaster();
    return instrumentDecorator(instance);
  }
  return instance;
}

const createInstance = (
  type,
  props,
  rootContainerInstance,
  currentHostContext,
  workInProgress
) => {
  const name = capitalize(type);
  const typeDef = getTypeDefinition(name);
  const { args = [], ...rest } = props;
  if (typeDef) {
    const { type: toneClass, constructor: Target } = typeDef;
    let instance = new Target(...args);
    Object.keys(rest).forEach(key => {
      if (ignoredProps.includes(key)) return;
      let root = instance;
      let value = props[key];
      let prop = instance[key];
      if (key.includes('-')) {
        const splitedKeys = key.split('-');
        prop = getDeepValue(instance, splitedKeys);
        if (!hasValueKey(prop)) {
          key = splitedKeys[splitedKeys.length - 1];
          root = getDeepValue(
            instance,
            splitedKeys.slice(0, splitedKeys.length - 1)
          );
        }
      }
      if (hasValueKey(prop)) {
        prop.value = value;
      } else if (root) {
        root[key] = value;
      }
    });

    instance = decorateInstance(instance, toneClass, props);
    return instance;
  } else if (isTrigger(type)) {
    const instance = {
      isTrigger: true,
      execute(instrument) {
        instrument[type](...args);
      }
    }
    return instance;
  }
  return null;
};

const appendChild = (parent, child) => {
  if (!parent || !child) return;
  if (parent[TONE_CLASS] === INSTRUMENT) {
    if (child.isTrigger) {
      child.execute(parent);
    }
  }
};

const hostConfig = {
  now,
  supportsMutation: true,
  isPrimaryRenderer: false,
  getRootHostContext(root) {
    return emptyObject;
  },
  getChildHostContext(parentContext, type, rootInstance) {
    return emptyObject;
  },
  shouldSetTextContent(type, nextProps) {
    return false;
  },
  createTextInstance(
    newText,
    rootContainerInstance,
    currentHostContext,
    workInProgress
  ) {},
  createInstance,
  appendInitialChild: (parent, child) => {
    appendChild(parent, child);
  },
  finalizeInitialChildren: (
    instance,
    type,
    newProps,
    rootContainerInstance,
    currentHostContext
  ) => {
    return false;
  },
  prepareForCommit(rootContainerInstance) {},
  resetAfterCommit(rootContainerInstance) {},
  commitMount: (domElement, type, newProps, fiberNode) => {},
  appendChildToContainer: appendChild,
  prepareUpdate(
    instance,
    type,
    oldProps,
    newProps,
    rootContainerInstance,
    currentHostContext
  ) {
    console.log('prepare update');
    return emptyObject;
  },
  commitUpdate(
    instance,
    updatePayload,
    type,
    oldProps,
    newProps,
    finishedWork
  ) {
    // TODO:
    console.log('commit update');
  },
  commitTextUpdate(textInstance, oldText, newText) {},
  appendChild,
  insertBefore(parentInstance, child, beforeChild) {
    parentInstance.insertBefore(child, beforeChild);
  },
  removeChild(parentInstance, child) {
    parentInstance.removeChild(child);
  },
  insertInContainerBefore(container, child, beforeChild) {
    container.insertBefore(child, beforeChild);
  },
  removeChildFromContainer(container, child) {
    container.removeChild(child);
  },
  resetTextContent(domElement) {},
  shouldDeprioritizeSubtree(type, nextProps) {
    return false;
  },
  schedulePassiveEffects: scheduleDeferredCallback,
  cancelPassiveEffects: cancelDeferredCallback,
  getPublicInstance(instance) {
    return instance;
  }
};

const Renderer = Reconciler(hostConfig);

export function render(element, container, callback) {
  let root = roots.get(container);
  if (!root) {
    root = Renderer.createContainer(container);
    roots.set(container, root);
  }
  Renderer.updateContainer(element, root, null, callback);
  return Renderer.getPublicRootInstance(root);
}
