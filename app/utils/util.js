import find from "lodash/find";

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

export const statusTextCls = (status) => {
  let cls = '',
    color = 'blue';
  switch (status) {
    case 'failed':
      cls = 'danger';
      color = 'red';
      break;
    case 'pending':
      cls = 'normal';
      color = 'green';
      break;
    default:
      break;
  }
  return {
    cls,
    color
  };
};

export const formatCTRunner = (ctRunnerList, cTRunnerId) => {
  const { Tags } = find(ctRunnerList || [], [ 'ID', cTRunnerId ]) || {};
  return Tags && Tags.join() || cTRunnerId;
};


/**
 * 通过一个名字数组在另一个全量数组中找到指定的objName值并返回另一个数组
 * @param {String} objName
 */
export const changeArrByObj = (valueArr, allObjArr, objName) => {
  return valueArr.reduce((pro, currentValue) => {
    let k = ((allObjArr.filter(d => d.name === currentValue) || [])[0])[objName];
    let array = [k];
    return array.concat(pro);
  }, []);
};

// 计算正整数的位数
export const getNumLen = (num) => {
  let len = 0;
  while (num >= 1) {
    num = num / 10;
    len++;
  }
  return len;
};

/**
 * 安全JsonParse转换
 * @param {text[, reviver] => array} nativeParam native params of JSON.parse
 * @param {json object} emptyData default return result on result is empty
 * @returns {json object} return result
 */
export const safeJsonParse = (nativeParam, emptyData = {}) => {
  try {
    return JSON.parse(...nativeParam) || emptyData;
  } catch (error) {
    return emptyData;
  }
};

/**
 * 安全JsonStringify转换
 * @param {value[, replacer[, space]] => array} nativeParamArr native params of JSON.stringify
 * @param {string} emptyData default return result on result is empty
 * @returns {string} return result
 */
export const safeJsonStringify = (nativeParam, emptyData = '') => {
  try {
    return JSON.stringify(...nativeParam) || emptyData;
  } catch (error) {
    return emptyData;
  }
};
