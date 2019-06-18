import axios from 'axios';
import isPlainObject from 'lodash/isPlainObject';
import omit from 'lodash/omit';

const isUseBodyMethod = method => ['post', 'put', 'patch'].indexOf(method) >= 0;

const objectToUrlSearchParams = obj => {
  if (!isPlainObject(obj)) return null;
  const params = new URLSearchParams();
  const keys = Object.keys(obj);
  keys.forEach(key => {
    const value = obj[key];
    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v));
    } else if (typeof value === 'object') {
      params.append(key, JSON.stringify(value));
    } else {
      params.append(key, value);
    }
  });
  return params;
};

const paramRegExp = /:([^/]*?)(?=\/|$)/g;

const processParameterizedUrl = (url, data) => {
  if (typeof url !== 'string' || url.trim() === '') {
    return { url: '', keys: [] };
  }

  const keys = [];
  const newUrl = url.replace(paramRegExp, (match, param) => {
    keys.push(param);
    return data[param];
  });

  return {
    url: newUrl,
    keys
  };
};

const wrapHttpPromise = (promise, props) => {
  const wrapper = ['then', 'catch', 'finally'].reduce((o, k) => {
    o[k] = (...args) => promise[k](...args);
    return o;
  }, {});
  return Object.assign(wrapper, props);
};

class ApiClient {
  constructor(options = {}) {
    this.inst = axios.create(options);
  }

  registerInterceptor(type, resolve, reject) {
    if (this.inst.interceptors[type]) {
      this.inst.interceptors[type].use(resolve, reject);
    }
  }

  unregisterInterceptor(type, interceptor) {
    if (this.inst.interceptors[type]) {
      this.inst.interceptors[type].eject(interceptor);
    }
  }

  registerRequestInterceptor(resolve, reject) {
    this.registerInterceptor('request', resolve, reject);
  }

  registerResponseInterceptor(resolve, reject) {
    this.registerInterceptor('response', resolve, reject);
  }

  unregisterRequestInterceptor(interceptor) {
    this.unregisterInterceptor('request', interceptor);
  }

  unregisterResponseInterceptor(interceptor) {
    this.unregisterInterceptor('response', interceptor);
  }

  get(url, options) {
    return this.requestBuilder('get', url, options);
  }

  post(url, options) {
    return this.requestBuilder('post', url, options);
  }

  put(url, options) {
    return this.requestBuilder('put', url, options);
  }

  delete(url, options) {
    return this.requestBuilder('delete', url, options);
  }

  patch(url, options) {
    return this.requestBuilder('patch', url, options);
  }

  request(method, url, data, options) {
    const { useBody, useSearchParams, key, ...restOptions } = options;
    const { url: requestUrl, keys: usedKeys } = processParameterizedUrl(
      url,
      data
    );
    data = omit(data, usedKeys);
    if (useSearchParams) {
      data = objectToUrlSearchParams(data);
    }
    let cancel;
    restOptions.cancelToken = new axios.CancelToken(c => {
      cancel = c;
    });

    let httpPromise;
    if (isUseBodyMethod(method)) {
      httpPromise = this.inst[method](requestUrl, data, restOptions);
    } else if (useBody) {
      restOptions.data = data;
      httpPromise = this.inst[method](requestUrl, restOptions);
    } else {
      if (useSearchParams) {
        data = objectToUrlSearchParams(data);
      }
      restOptions.params = data;
      httpPromise = this.inst[method](requestUrl, restOptions);
    }

    httpPromise = wrapHttpPromise(httpPromise, { cancel });

    return httpPromise;
  }

  requestBuilder(method, url, options = {}) {
    return (data, extendedOptions = {}) =>
      this.request(
        method,
        url,
        data,
        Object.assign({}, options, extendedOptions)
      );
  }
}

export default ApiClient;
