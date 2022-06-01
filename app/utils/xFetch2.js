import xFetch, { xFetch_nologin } from './xFetch';
import md5 from 'blueimp-md5';
import { flatObj } from './util';
import secretKey from './sk';

export function get(url, options) {
  return xFetch(url, options);
}

export function get_nologin(url, options) {
  return xFetch_nologin(url, options);
}

export function getWithArgs(url, args, options) {
  args = args || {};

  for (const attr in args) {
    if (args[attr] === undefined || args[attr] === null || args[attr] === '') {
      delete args[attr];
    }
  }

  let keys = Object.keys(args);
  keys = keys
    .map(key => {
      if (options && options.isEncodeParams) {
        return `${key}=${encodeURIComponent(args[key])}`;
      }
      return `${key}=${args[key]}`;
    })
    .join('&');
  url = url + '?' + keys;
  return get(url, options);
}

export function post(url, data, options) {
  const opts = {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    ...options,
    body: JSON.stringify(data)
  };
  return xFetch(url, opts);
}

export function post_nologin(url, data, options) {
  const opts = {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    ...options,
    body: JSON.stringify(data)
  };
  return xFetch_nologin(url, opts);
}

export function postFile(url, data, options) {
  const opts = {
    ...options,
    method: 'POST',
    cache: 'no-cache',
    headers: {
    },
    body: data
  };
  return xFetch(url, opts);
}

export function del(url, data = {}, options) {
  const opts = {
    ...options,
    method: 'DELETE',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  return xFetch(url, opts);
}

export function put(url, data, options) {
  const opts = {
    ...options,
    method: 'PUT',
    cache: 'no-cache',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  return xFetch(url, opts);
}


function injectSign (rawData) {
  const requestTime = new Date() - 0;
  const shallowData = JSON.parse(JSON.stringify(rawData));
  shallowData.requestTime = requestTime;
  shallowData.sign = md5(flatObj(shallowData) + (secretKey.sk || ''));
  return shallowData;
}
