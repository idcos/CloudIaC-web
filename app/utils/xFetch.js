import { logout } from 'services/logout';
import { getMatchParams } from 'utils/util';
import { t, getLanguage } from 'utils/i18n';
import { notification } from 'antd';

function parseJSON(res) {
  return res
    .json()
    .then(jsonResult => {
      return { ...res, jsonResult, httpCode: res.status };
    })
    .catch(() => {
      throw new Error(t('define.message.interfaceFail'));
    });
}

function parseCommon(res) {
  return { ...res, httpCode: res.status };
}

async function xFetch(url, options) {
  const opts = {
    isEncode: true,
    needDefaultHeader: true,
    ...options,
    credentials: 'include',
    redirect: 'manual',
  };
  const token = localStorage['accessToken'];
  const { orgId } = getMatchParams();
  const language = getLanguage();
  const acceptLanguageMap = {
    zh: 'zh-CN',
    en: 'en-US',
  };
  const defaultHeader = {
    Authorization: token,
    'IaC-Org-Id': opts['IaC-Org-Id'] || orgId || '',
    'IaC-Project-Id': opts['IaC-Project-Id'] || '',
  };
  // 默认使用defaultHeader请求头
  if (opts.needDefaultHeader) {
    opts.headers = {
      ...defaultHeader,
      ...opts.headers,
    };
  }

  opts.headers = {
    ...opts.headers,
    'Accept-Language': acceptLanguageMap[language] || 'zh-CN',
  };

  if (opts.isEncode && !opts.isEncodeParams) {
    url = encodeURI(url);
  }
  try {
    const fetchResponse = await fetch(url, opts);
    const jsonResponse = await parseJSON(fetchResponse);
    if (jsonResponse.httpCode === 401) {
      if (options && options.disableLogout === true) {
        return jsonResponse.jsonResult;
      }
      // Here for your logout logic.
      logout();
      return;
    } else if (jsonResponse.httpCode === 403) {
      // 使用window.location.href不用location.push跳转 防止后续代码执行导致的报错等问题
      const callbackUrl = window.location.href;
      window.location.href = `/no-access?callbackUrl=${encodeURIComponent(
        callbackUrl,
      )}`;
      return;
    } else {
      return jsonResponse.jsonResult;
    }
  } catch (e) {
    notification.error({
      message: t('define.message.interfaceFail'),
    });
  }
}
export const xFetch_nologin = async (url, options) => {
  const opts = { isEncode: true, ...options, credentials: 'include' };
  const token = localStorage['accessToken'];
  const { orgId } = getMatchParams();
  const language = getLanguage();
  const acceptLanguageMap = {
    zh: 'zh-CN',
    en: 'en-US',
  };
  opts.headers = {
    Authorization: token,
    ...opts.headers,
    'IaC-Org-Id': opts['IaC-Org-Id'] || orgId || '',
    'IaC-Project-Id': opts['IaC-Project-Id'] || '',
    'Accept-Language': acceptLanguageMap[language] || 'zh-CN',
  };

  if (opts.isEncode && !opts.isEncodeParams) {
    url = encodeURI(url);
  }
  const fetchResponse = await fetch(url, opts);
  const jsonResponse = await parseCommon(fetchResponse);
  return jsonResponse;
};

export default xFetch;
