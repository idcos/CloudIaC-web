import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const baseUrl = '/api/v1/policies';

// 策略api
const policiesAPI = {
  // 查询策略列表
  list: (params) => {
    return getWithArgs(baseUrl, params);
  },
  // 创建策略
  create: (params) => {
    return post(baseUrl, params);
  },
  // 策略详情
  detail: (id) => {
    return get(`${baseUrl}/${id}`);
  },
  // 修改策略
  update: ({ id, ...restParams }) => {
    return put(`${baseUrl}/${id}`, restParams);
  },
  // 云模板/环境源码解析
  parse: (params) => {
    return post(`${baseUrl}/parse`, params);
  }, 
  // 策略测试
  test: (params) => {
    return post(`${baseUrl}/test`, params);
  },
  // 策略屏蔽列表
  listSuppress: ({ policyId, ...restParams }) => {
    return getWithArgs(`${baseUrl}/${policyId}/suppress`, restParams);
  }, 
 


  // 删除策略
  del: (id) => {
    return del(`${baseUrl}/${id}`, {});
  },
  // 策略详情-错误
  error: (id) => {
    return get(`${baseUrl}/${id}/error`);
  }, 
  // 策略详情-报表
  report: (id) => {
    return get(`${baseUrl}/${id}/report`);
  },
  // 创建策略屏蔽
  createSuppress: (params) => {
    return post(`${baseUrl}/suppress`, params);
  }, 
  // 删除策略屏蔽
  delSuppress: (params) => {
    return del(`${baseUrl}/suppress`, params);
  }
};

export default policiesAPI;