function parseJSON(res) {
  return res.json().then(jsonResult => {
    return { ...res, jsonResult, httpCode: res.status };
  }).catch(() => {
    throw new Error('系统错误');
  });
}

import { logout } from 'services/logout';

async function xFetch(url, options) {
  const opts = { isEncode: true, ...options, credentials: 'include' };
  const token = localStorage['accessToken'];
  opts.headers = {
    ...opts.headers,
    'Authorization': token,
    'IaC-Org-Id': opts['IaC-Org-Id'] || '',
    'IaC-Project-Id': opts['IaC-Project-Id'] || ''
  };
  if (opts.isEncode) {
    url = encodeURI(url);
  }
  const fetchResponse = await fetch(url, opts);
  const jsonResponse = await parseJSON(fetchResponse);
  if (jsonResponse.httpCode == 401) {
    // Here for your logout logic.
    logout();
    return;
  } else {
    return jsonResponse.jsonResult;
  }
}

export default xFetch;
