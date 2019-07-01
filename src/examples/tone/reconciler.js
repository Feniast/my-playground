import React from 'react';
import Reconciler from 'react-reconciler';
import {
  unstable_scheduleCallback as scheduleDeferredCallback,
  unstable_cancelCallback as cancelDeferredCallback,
  unstable_now as now,
  unstable_IdlePriority as idlePriority,
  unstable_runWithPriority as run
} from 'scheduler';
import { capitalize } from './util';
import { TONE_CLASS, INSTRUMENT } from './constants';
import { getTypeDefinition, registerType as registerToneClass } from './toneType';
import Instrument from './components/instrument';
import { connectChild } from './components/relations';

const roots = new Map();

const emptyObject = Object.create(null);

const isTrigger = (str) => ['triggerAttack', 'triggerRelease', 'triggerAttackRelease'].includes(str);

const createInstance = (
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
    let instance = null;
    switch (toneClass) {
      case INSTRUMENT:
        instance = new Instrument(Target, props);
        break;
      default:
        break;
    }

    return instance;
  } else if (isTrigger(type)) {
    const { args = [] } = props;
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
  if (parent.appendChild) {
    parent.appendChild(child);
  } else {
    connectChild(parent, child);
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

export {
  registerToneClass
};
