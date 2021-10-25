import { post, put, del, getWithArgs } from 'utils/xFetch2';

const varGroupAPI = {
  // 查询变量组列表
  list: ({ orgId, ...restParams }) => {
    return getWithArgs('/api/v1/var_groups', restParams, {
      'IaC-Org-Id': orgId
    });
  },
  // 创建变量组
  create: ({ orgId, ...restParams }) => {
    return post(`/api/v1/var_groups`, restParams, {
      'IaC-Org-Id': orgId
    });
  },
  // 更新变量组
  update: ({ orgId, id, ...restParams }) => {
    return put(`/api/v1/var_groups/${id}`, restParams, {
      'IaC-Org-Id': orgId
    });
  },
  del: ({ orgId, id }) => {
    return del(`/api/v1/var_groups/${id}`, {}, {
      'IaC-Org-Id': orgId
    });
  },
  detail: ({ orgId, id }) => {
    return getWithArgs(`/api/v1/var_groups/${id}`, {}, {
      'IaC-Org-Id': orgId
    });
  },
  listRelationship: ({ orgId, projectId, ...restParams }) => {
    return getWithArgs('/api/v1/var_groups/relationship', restParams, {
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId 
    });
  },
  // createRelationship: ({ orgId, projectId, ...restParams }) => {
  //   return post(`/api/v1/var_groups/relationship`, restParams, {
  //     'IaC-Org-Id': orgId,
  //     'IaC-Project-Id': projectId 
  //   });
  // },
  // delRelationship: ({ orgId, projectId, ...restParams }) => {
  //   return post(`/api/v1/var_groups/relationship`, restParams, {
  //     'IaC-Org-Id': orgId,
  //     'IaC-Project-Id': projectId 
  //   });
  // },
};

export default varGroupAPI;