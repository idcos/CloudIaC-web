import { notification } from "antd";
import noop from 'lodash/noop'

export const requestWrapper = (apiFn, options) => {

  const {
    autoError = true, // 是否自动抛出错误信息
    autoSuccess = false, // 是否自动抛出成功信息
    successMessage, // 自定义成功信息
    errorMessage, // 自定义错误信息
    errorJudgeFn = (res) => res.code != 200, // 接口返回数据错误的判断方法
    formatDataFn = (res) => res.result, // 格式化返回数据
    getErrorFn = noop
  } = options || {};
  
  return new Promise(async (resolve, reject) => {
    try {
      const res = await apiFn();
      if (getErrorFn(res) || errorJudgeFn(res)) {
        throw new Error(getErrorFn(res) || res.message);
      }
      const data = formatDataFn(res);
      autoSuccess && notification.success({
        message: successMessage || res.message || '操作成功'
      });
      resolve(data);
    } catch (err) {
      autoError && notification.error({
        message: errorMessage || err.message || '操作失败'
      });
      reject(err);
    }
  });
};