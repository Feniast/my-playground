import Base from './base';
import {
  equal,
  isFunction,
  isUndefined,
  isArray,
  omit,
  noop,
  getDeepValue,
  hasKey
} from '../util';

const DefaultIgnoredProps = ['children', 'key', 'ref'];

export default class CompBase extends Base {
  constructor(targetConstructor, props) {
    super();
    const { args = [], ...rest } = props;
    this._instance = new targetConstructor(...args);
    this.applyProps(rest);
  }

  getIgnoredProps() {
    return [];
  }

  applyHandlers(instance, handlers) {
    noop();
  }

  applyProps(newProps = {}, oldProps = {}) {
    const instance = this._instance;
    const sameProps = Object.keys(newProps).filter(p =>
      equal(newProps[p], oldProps[p])
    );
    const handlers = Object.keys(newProps).filter(
      p => isFunction(p) && p.startsWith('on')
    );
    const leftOvers = Object.keys(oldProps).filter(p =>
      isUndefined(newProps[p])
    );
    let ignoredProps = this.getIgnoredProps();
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
    this.applyHandlers(instance, handlersObj);
  }
}
