import { notification } from "antd";
import noop from 'lodash/noop'

export const requestWrapper = (apiFn, options) => {

  const {
    autoError = true, // 是否自动抛出错误信息
    autoSuccess = false, // 是否自动抛出成功信息
    showErrMsgDescription = false, // 是否展示错误描述
    successMessage, // 自定义成功信息
    errorMessage, // 自定义错误信息
    errorJudgeFn = (res) => res.code != 200, // 接口返回数据错误的判断方法
    formatDataFn = (res) => res.result // 格式化返回数据
  } = options || {};
  
  return new Promise(async (resolve, reject) => {
    try {
      const res = await apiFn();
      if (errorJudgeFn(res)) {
        const err = {
          message: res.message,
          description: showErrMsgDescription ? res.message_detail : undefined
        };
        throw err;
      }
      const data = formatDataFn(res);
      autoSuccess && notification.success({
        message: successMessage || res.message || '操作成功'
      });
      resolve(data);
    } catch (err) {
      autoError && notification.error({
        message: errorMessage || err.message || '操作失败',
        description: err.description 
      });
      reject(err);
    }
  });
};