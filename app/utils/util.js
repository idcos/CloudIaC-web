import find from "lodash/find";
import { matchPath } from 'react-router-dom';

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
    const str = JSON.stringify(...nativeParam);
    return str === 'null' || str === 'undefined' ? emptyData : str;
  } catch (error) {
    return emptyData;
  }
};

/**
 * 校验是否是Json字符串
 * @param {string} str 
 * @returns {boolean}
 */
export const isJsonString = (str) => {
  if (typeof str !== 'string') {
    return false;
  }
  try {
    const obj = JSON.parse(str);
    return typeof obj == 'object' && obj;
  } catch (e) {
    return false;
  }
};


export const ellipsisText = (text, maxLen = 15) => {
  text = text || '';
  return text.length > maxLen ? (text.slice(0, maxLen) + '...') : text;
};

// 导出文件

export const downloadImportTemplate = async(downloadApi, opts) => {
  try {
    const token = localStorage['accessToken'];
    const res = await fetch(downloadApi, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token,
        'IaC-Org-Id': opts.orgId || '',
        'IaC-Project-Id': opts['IaC-Project-Id'] || ''
      }
    });
    const fileNameEncode = res.headers.get('content-disposition').split('filename="')[1];
    const fileNameDecode = decodeURIComponent(fileNameEncode).replace(/^\"|\"$/g, '');
    if (res.status == 200) {
      let filename = fileNameDecode;
      res.blob().then(blob => {
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(link.href);
      });
    } else {
      throw res.statusText;
    }
  } catch (error) {
    console.log(error);
  }

};

export const getMatchParams = () => {
  const match = matchPath(window.location.pathname, [ '/org/:orgId/project/:projectId', '/org/:orgId' ]) || {};
  const { orgId, projectId } = match.params || {};
  return { orgId, projectId };
};

export const getRegistryIconUrl = (logo, featured = false) => {
  if (!logo) {
    if (!featured) {
      return '/assets/img/local_from.svg';
    } else {
      return '/assets/img/local_featured.png';
    }
  }
  if (logo.startsWith('/api/v1')) {
    return logo.replace('/api/v1', '/registry/api/v1');
  }
  return (logo.startsWith('/') || logo.startsWith('http')) ? logo : `/registry/api/v1/icons?path=${logo}`;
};