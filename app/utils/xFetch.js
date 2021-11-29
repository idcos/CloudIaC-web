function parseJSON(res) {
  return res.json().then(jsonResult => {
    return { ...res, jsonResult, httpCode: res.status };
  }).catch(() => {
    throw new Error('接口错误');
  });
}

import { logout } from 'services/logout';
import history from 'utils/history';

async function xFetch(url, options) {
  const opts = { isEncode: true, ...options, credentials: 'include' };
  const token = localStorage['accessToken'];
  opts.headers = {
    ...opts.headers,
    'Authorization': token,
    'IaC-Org-Id': opts['IaC-Org-Id'] || '',
    'IaC-Project-Id': opts['IaC-Project-Id'] || ''
  };
  if (opts.isEncode && !opts.isEncodeParams) {
    url = encodeURI(url);
  }
  const fetchResponse = await fetch(url, opts);
  const jsonResponse = await parseJSON(fetchResponse);
  if (jsonResponse.httpCode == 401) {
    // Here for your logout logic.
    logout();
    return;
  } else if (jsonResponse.httpCode == 403) {
    // 使用window.location.href不用location.push跳转 防止后续代码执行导致的报错等问题
    window.location.href = `/no-access`;
    return;
  } else {
    return jsonResponse.jsonResult;
  }
}

export default xFetch;
