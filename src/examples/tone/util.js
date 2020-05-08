export const capitalize = str => {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
};

export const hasKey = (o, key) =>
  o && isObject(o) && (key in o);

export const getDeepValue = (o = {}, keys = []) =>
  keys.reduce((v, k) => {
    if (v) return v[k];
    return undefined;
  }, o);

export const noop = () => {};

export const warn = (...args) => console.warn(...args);

export const type = o => Object.prototype.toString.call(o);

export const isObject = o => type(o) === '[object Object]';

export const isFunction = o => type(o) === '[object Function]';

export const isUndefined = o => type(o) === '[object Undefined]';

export const isArray = o => type(o) === '[object Array]';

export const equal = (a, b) => {
  if (a === b) return true;
  if (type(a) !== type(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  if (isObject(a)) {
    const keys = Object.keys(a).concat(Object.keys(b));
    for (let k of keys) {
      if (a[k] !== b[k]) return false;
    }
    return true;
  }

  return false;
};

export const omit = (o, keys = []) => {
  if (!isObject(o) || !isArray(keys) || keys.length === 0) return o;
  const newObject = {};
  const allKeys = Object.keys(o);
  for (let k of allKeys) {
    if (keys.indexOf(k) >= 0) continue;
    newObject[k] = o[k];
  }
  return newObject;
}