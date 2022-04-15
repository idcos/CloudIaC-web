import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const ctplAPI = {
  // 查询云模板策略配置
  list: ({ ...restParams }) => {
    return getWithArgs('/api/v1/policies/templates', restParams, {});
  },
  // 云模板策略扫描结果
  result: ({ tplId, ...restParams }) => {
    return getWithArgs(`/api/v1/policies/templates/${tplId}/result`, restParams, {});
  },
  // 修改云模板与策略组关联
  update: ({ tplId, ...restParams }) => {
    return put(`/api/v1/policies/templates/${tplId}`, restParams, {});
  },
  // 运行云模板策略扫描
  runScan: ({ tplId, ...restParams }) => {
    return post(`/api/v1/policies/templates/${tplId}/scan`, restParams, {});
  },
  // 批量运行云模板策略扫描
  runBatchScan: (params) => {
    return post(`/api/v1/policies/templates/scans`, params, {});
  },
  // 启用/禁用云模板扫描
  enabled: ({ id, ...restParams }) => {
    return put(`/api/v1/policies/templates/${id}/enabled`, restParams, {});
  },
  // 查询云模板绑定的策略组
  listBindPoliciesGroups: ({ id, ...restParams }) => {
    return getWithArgs(`/api/v1/policies/templates/${id}/groups`, restParams, {});
  }
};

export default ctplAPI;