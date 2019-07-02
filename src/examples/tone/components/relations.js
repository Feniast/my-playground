import Tone from 'tone';
import {
  isArray,
  isObject,
  isFunction,
  equal,
  isUndefined,
  omit,
  getDeepValue,
  hasKey
} from '../util';

const DefaultIgnoredProps = ['children', 'key', 'ref'];

export const applyProps = (
  instance,
  newProps = {},
  oldProps = {},
  ignoredProps = [],
  applyHandlers
) => {
  const sameProps = Object.keys(newProps).filter(p =>
    equal(newProps[p], oldProps[p])
  );
  const handlers = Object.keys(newProps).filter(
    p => isFunction(p) && p.startsWith('on')
  );
  const leftOvers = Object.keys(oldProps).filter(p => isUndefined(newProps[p]));
  if (!isArray(ignoredProps)) {
    ignoredProps = [];
  }
  const props = omit(newProps, [
    ...sameProps,
    ...ignoredProps,
    ...DefaultIgnoredProps,
    ...handlers
  ]);

  // Add left-overs as undefined props so they can be removed
  leftOvers.forEach(key => (props[key] = undefined));
  Object.keys(props).forEach(key => {
    let root = instance;
    let value = props[key];
    let target = instance[key];
    if (key.indexOf('-') >= 0) {
      const entries = key.split('-');
      target = getDeepValue(instance, entries);
      if (!hasKey(target, 'value')) {
        key = entries[entries.length - 1];
        root = getDeepValue(instance, entries.slice(0, entries.length - 1));
      }
    }
    if (hasKey(target, 'value')) {
      target.value = value;
    } else {
      root[key] = value;
    }
  });
  const handlersObj = handlers.reduce(
    (acc, k) => ({ ...acc, [k]: newProps[k] }),
    {}
  );
  isFunction(applyHandlers) && applyHandlers(instance, handlersObj);
};

export const attachChild = (parent, child) => {
  if (!parent || !child) return;

  if (child.attach) parent[child.attach] = child;
  else if (child.attachArray) {
    if (!isArray(parent[child.attachArray])) parent[child.attachArray] = [];
    parent[child.attachArray].push(child);
  } else if (child.attachObject) {
    if (!isObject(parent[child.attachObject[0]]))
      parent[child.attachObject[0]] = {};
    parent[child.attachObject[0]][child.attachObject[1]] = child;
  }
};

export const detachChild = (parent, child) => {
  if (!parent || !child) return;
  if (child.attach) {
    parent[child.attach] = undefined;
  } else if (child.attachArray) {
    parent[child.attachArray] = parent[child.attachArray].filter(
      x => x !== child
    );
  } else if (child.attachObject) {
    parent[child.attachObject[0]][child.attachObject[1]] = undefined;
  }
};

export const connectChild = (parent, child) => {
  if (!child) return;
  if (child instanceof Tone.AudioNode) {
    console.log('connect audioNode');
    const dest = parent instanceof Tone.AudioNode ? parent : Tone.Master;
    child.connect(dest);
  }
};

export const disconnectChild = (parent, child) => {
  if (!child) return;
  if (child instanceof Tone.AudioNode) {
    child.disconnect();
  }
};
