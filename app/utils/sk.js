/**
 * 存放从后端读取用于md5摘要的salt
 * @type {{}}
 */
const secretKey = new Proxy({}, {
  get: function (target, key) {
    if (key === 'sk') {
      return Reflect.get(target, Symbol.for(key));
    }
    return undefined;
  },
  set: function (target, key, value) {
    if (key === 'sk') {
      return Reflect.set(target, Symbol.for(key), value);
    }
  }
});

export default secretKey;
