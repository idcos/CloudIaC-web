import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const cenvAPI = {
  // 查询环境策略配置
  list: ({ ...restParams }) => {
    return getWithArgs('/api/v1/policies/envs', restParams, {});
  },
  // 修改环境与策略组关联
  update: ({ tplId, ...restParams }) => {
    return put(`/api/v1/policies/envs`, restParams, {});
  },
  // 运行环境策略扫描
  runScan: ({ envId, ...restParams }) => {
    return post(`/api/v1/policies/envs/${envId}/scan`, restParams, {});
  },
  // 环境策略扫描结果
  result: ({ envId, ...restParams }) => {
    return getWithArgs(`/api/v1/policies/envs/${envId}/result`, restParams, {});
  },
  
  // 环境策略详情
  detail: ({ envId, ...restParams }) => {
    return getWithArgs(`/api/v1/policies/envs/${envId}`, restParams, {});
  }
};

export default cenvAPI;