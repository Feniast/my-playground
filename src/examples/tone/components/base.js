import { warn } from '../util';

const noImplWarn = name =>
  warn(
    `${name} is not implemented yet. You must implement it by yourself in your inherited classes if you want to support the function.`
  );

export default class Base {
  update() {
    noImplWarn('update');
  }

  appendChild(child) {
    noImplWarn('appendChild');
  }

  removeChild(child) {
    noImplWarn('removeChild');
  }

  insertBefore(child) {
    noImplWarn('insertBefore');
  }
}
