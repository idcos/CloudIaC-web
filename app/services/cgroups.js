import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const cgroupsAPI = {
  // 查询策略组列表
  list: ({ ...restParams }) => {
    return getWithArgs('/api/v1/policies/groups', restParams, {});
  },
  // 创建策略组
  create: ({ ...restParams }) => {
    return post('/api/v1/policies/groups', restParams, {});
  },
  // 策略组详情
  detail: ({ policyGroupId }) => {
    return get(`/api/v1/policies/groups/${policyGroupId}`);
  },
  // 修改策略组
  update: ({ policyGroupId, ...restParams }) => {
    return put(`/api/v1/policies/groups/${policyGroupId}`, restParams, {});
  },
  // 添加/移除策略与策略组的关系
  addAndDel: ({ policyGroupId, ...restParams }) => {
    return post(`/api/v1/policies/groups/${policyGroupId}`, restParams, {});
  },
  // 删除策略组
  del: ({ policyGroupId }) => {
    return del(`/api/v1/policies/groups/${policyGroupId}`, {}, {});
  },
  // 策略组最近扫描内容
  lastTasksList: ({ policyGroupId, ...restParams }) => {
    return getWithArgs(`/api/v1/policies/groups/${policyGroupId}/last_tasks`, restParams, {});
  },
  // 策略详情-报表
  report: ({ policyGroupId, ...restParams }) => {
    return getWithArgs(`/api/v1/policies/groups/${policyGroupId}/report`, restParams, { isEncodeParams: true });
  },
  // 查询策略组关联的策略或未关联策略组的策略
  isBind: ({ policyGroupId, ...restParams }) => {
    return getWithArgs(`/api/v1/policies/groups/${policyGroupId}/policies`, restParams, {});
  }

};

export default cgroupsAPI;