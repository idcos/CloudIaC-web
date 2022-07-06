import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

// 查询top位置5个数据
export const getStat = (orgIds) => {
  return getWithArgs('/api/v1/platform/stat/basedata', { orgIds }, {});
};
  // provider环境数量统计
export const getProviderEnv = (orgIds) => {
  return getWithArgs('/api/v1/platform/stat/provider/env', { orgIds }, {});
};
// provider资源数量占比
export const getProviderResource = (orgIds) => {
  return getWithArgs('/api/v1/platform/stat/provider/resource', { orgIds }, {});
};
// 资源类型占比
export const getProviderType = (orgIds) => {
  return getWithArgs('/api/v1/platform/stat/resource/type', { orgIds }, {});
};
// 一周资源变更趋势
export const getProviderWeek = (orgIds) => {
  return getWithArgs('/api/v1/platform/stat/resource/week', { orgIds }, {});
};
// 活跃资源数量
export const getProviderActive = (orgIds) => {
  return getWithArgs('/api/v1/platform/stat/resource/active', { orgIds }, {});
};
// 获取活动日志
export const getoPerationLog = (orgIds) => {
  return getWithArgs('/api/v1/platform/operation/log', { orgIds }, {});
};




// /**
//  * 获取ci类依赖关系
//  * @param tableName - 表名
//  * @returns {Promise<never>|Promise<*>}
//  */
// export const getCIDependencies = (tableName) => get(`/api/v1/record/ci/relationship/dependencies/${tableName}`);

// /**
//  * 获取ci类标识规则
//  * @param tableName - 表名
//  * @returns {Promise<never>|Promise<*>}
//  */
// export const getCIIdentificationRule = tableName => get(`/api/v1/record/ci/identification/${tableName}`);
