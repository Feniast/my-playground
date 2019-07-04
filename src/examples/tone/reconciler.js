import React from 'react';
import Reconciler from 'react-reconciler';
import {
  unstable_scheduleCallback as scheduleDeferredCallback,
  unstable_cancelCallback as cancelDeferredCallback,
  unstable_now as now
} from 'scheduler';
import {
  createInstance,
  createRoot,
  appendChild,
  removeChild,
  insertBefore,
  commitUpdate
} from './component';
import { registerToneClass } from './toneType';
import { ON_RENDER } from './constants';

const roots = new Map();

const emptyObject = Object.create(null);

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
  appendInitialChild: appendChild,
  finalizeInitialChildren: (
    instance,
    type,
    newProps,
    rootContainerInstance,
    currentHostContext
  ) => {
    return instance && instance[ON_RENDER];
  },
  prepareForCommit(rootContainerInstance) {},
  resetAfterCommit(rootContainerInstance) {},
  commitMount: (instance, type, newProps, fiberNode) => {
    instance[ON_RENDER]();
  },
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
    commitUpdate(
      instance,
      updatePayload,
      type,
      oldProps,
      newProps,
      finishedWork
    );
    instance[ON_RENDER] && instance[ON_RENDER]();
    console.log('commit update', instance);
  },
  commitTextUpdate(textInstance, oldText, newText) {},
  appendChild,
  insertBefore,
  removeChild,
  insertInContainerBefore: insertBefore,
  removeChildFromContainer: removeChild,
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

export function unmountComponentAtNode(container) {
  const root = roots.get(container);
  if (root)
    Renderer.updateContainer(null, root, null, () => roots.delete(container));
}

export { createRoot, registerToneClass };

Renderer.injectIntoDevTools({
  bundleType: process.env.NODE_ENV === 'production' ? 0 : 1,
  version: '0.0.1',
  rendererPackageName: 'react-tone',
  findHostInstanceByFiber: Renderer.findHostInstance
});
