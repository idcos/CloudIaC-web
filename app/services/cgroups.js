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
  detail: ({ policiesId, ...restParams }) => {
    return getWithArgs(`/api/v1/policies/groups/${policiesId}`, { restParams }, {});
  },
  // 修改策略组
  update: ({ policiesId, ...restParams }) => {
    return put(`/api/v1/policies/groups/${policiesId}`, restParams, {});
  },
  // 添加/移除策略与策略组的关系
  addAndDel: ({ policiesId, ...restParams }) => {
    return post(`/api/v1/policies/groups/${policiesId}`, restParams, {});
  },
  // 删除策略组
  del: ({ policiesId }) => {
    return del(`/api/v1/policies/groups/${policiesId}`, {}, {});
  },
  // 策略组最近扫描内容
  lastTasksInfo: ({ policyGroupId, ...restParams }) => {
    return getWithArgs(`/api/v1/policies/${policyGroupId}/last_tasks`, restParams, {});
  },
  // 策略详情-报表
  report: ({ policyGroupId, ...restParams }) => {
    return getWithArgs(`/api/v1/policies/${policyGroupId}/report`, restParams, {});
  }
};

export default cgroupsAPI;