
import { logout } from 'services/logout';
import { getMatchParams } from 'utils/util';
import { t, getLanguage } from 'utils/i18n';

function parseJSON(res) {
  return res.json().then(jsonResult => {
    return { ...res, jsonResult, httpCode: res.status };
  }).catch(() => {
    throw new Error(t('define.message.interfaceFail'));
  });
}

async function xFetch(url, options) {

  const opts = { isEncode: true, ...options, credentials: 'include' };
  const token = localStorage['accessToken'];
  const { orgId } = getMatchParams();
  const language = getLanguage();
  const acceptLanguageMap = {
    zh: 'zh-CN',
    en: 'en-US'
  };
  opts.headers = {
    ...opts.headers,
    'Authorization': token,
    'IaC-Org-Id': opts['IaC-Org-Id'] || orgId || '',
    'IaC-Project-Id': opts['IaC-Project-Id'] || '',
    'Accept-Language': acceptLanguageMap[language] || 'zh-CN'
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
    window.location.href = `/no-access?callbackUrl=${encodeURIComponent(callbackUrl)}`;
    return;
  } else {
    return jsonResponse.jsonResult;
  }
}

export default xFetch;
