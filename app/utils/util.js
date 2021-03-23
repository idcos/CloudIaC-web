/**
 * 将对象字段按照key排序，并返回`${key}${value}`字符串
 * @param obj
 * @return {string}
 */
export function flatObj(obj) {
  const compare = (a, b) => {
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    return 0;
  };
  const keys = Object.keys(obj).sort(compare);
  let res = keys.map(key => {
    return `${key}${(obj[key] !== null && typeof obj[key] === 'object') ? JSON.stringify(obj[key]) : obj[key]}`;
  }).join('');
  return res;
}

/**
 * qiankun框架内修正图片路径
 * @param {String} url 
 */
export function formatImgUrl(url) {
  // eslint-disable-next-line no-undef
  return window.__POWERED_BY_QIANKUN__ ? `${__webpack_public_path__}/${url}` : url;
}
