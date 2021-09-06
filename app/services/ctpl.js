import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const ctplAPI = {
  // 查询云模板策略配置
  list: ({ ...restParams }) => {
    return getWithArgs('/api/v1/policies/templates', restParams, {});
  },
  // 云模板策略扫描结果
  result: ({ tplId, ...restParams }) => {
    return post(`/api/v1/policies/template/${tplId}/result`, restParams, {});
  },
  // 修改云模板与策略组关联
  update: ({ tplId, ...restParams }) => {
    return put(`/api/v1/policies/templates`, restParams, {});
  },
  // 运行云模板策略扫描
  runScan: ({ tplId, ...restParams }) => {
    return post(`/api/v1/policies/templates/${tplId}/scan`, restParams, {});
  },
  // 云模板策略详情
  detail: ({ tplId, ...restParams }) => {
    return getWithArgs(`/api/v1/policies/templates/${tplId}`, restParams, {});
  }
};

export default ctplAPI;