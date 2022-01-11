function parseJSON(res) {
  return res.json().then(jsonResult => {
    return { ...res, jsonResult, httpCode: res.status };
  }).catch(() => {
    throw new Error('接口错误');
  });
}

import { logout } from 'services/logout';
import { matchPath } from 'react-router-dom';

async function xFetch(url, options) {

  const opts = { isEncode: true, ...options, credentials: 'include' };
  const token = localStorage['accessToken'];
  const match = matchPath(window.location.pathname, [ '/org/:orgId/project/:projectId', '/org/:orgId' ]) || {};
  const { orgId, projectId } = match.params || {};

  opts.headers = {
    ...opts.headers,
    'Authorization': token,
    'IaC-Org-Id': opts['IaC-Org-Id'] || orgId || '',
    'IaC-Project-Id': opts['IaC-Project-Id'] || projectId || ''
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
    const callbackUrl = window.location.href;
    // window.location.href = `/no-access?callbackUrl=${encodeURIComponent(callbackUrl)}`;
    return;
  } else {
    return jsonResponse.jsonResult;
  }
}

export default xFetch;
