import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const envAPI = {
  // 环境列表
  envsList: ({ orgId, projectId, status, ...restParams }) => {
    let values = { 
      pageSize: 0
    };
    if (status == 'filed') {
      values.archived = true;
    } else {
      values.status = status;
    }
    return getWithArgs('/api/v1/envs', {
      ...values,
      ...restParams
    }, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  },
  // 环境详情
  envsInfo: ({ envId, orgId, projectId }) => {
    return getWithArgs(`/api/v1/envs/${envId}`, {
    }, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  },
  // 环境修改
  envsEdit: ({ envId, orgId, projectId, ...resetParams }) => {
    return put(`/api/v1/envs/${envId}`, {
      ...resetParams
    }, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  },
  // 环境归档
  envsArchive: ({ envId, orgId, projectId }) => {
    return put(`/api/v1/envs/${envId}/archive`, {
      archived: true
    }, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  },
  
  // 环境重新部署
  envRedeploy: ({ envId, projectId, orgId, ...resetParams }) => {
    return post(`/api/v1/envs/${envId}/deploy`, { ...resetParams }, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  },
  //销毁环境资源
  envDestroy: ({ envId, projectId, orgId }) => {
    return post(`/api/v1/envs/${envId}/destroy`, { "taskType": "destroy"
    }, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  },
  // 获取环境资源列表
  getResourcesList: ({ envId, orgId, projectId, q }) => {
    return getWithArgs(`/api/v1/envs/${envId}/resources`, {
      pageSize: 0,
      q
    }, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  },
  getResourcesGraphDetail: ({ envId, orgId, projectId, resourceId }) => {
    return get(`/api/v1/envs/${envId}/resources/graph/${resourceId}`, { 
      'IaC-Org-Id': orgId, 
      'IaC-Project-Id': projectId 
    });
  },
  getResourcesGraphList: ({ envId, orgId, projectId, dimension }) => {
    return getWithArgs(`/api/v1/envs/${envId}/resources/graph`, {
      dimension
    }, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  },
  getOutput: ({ orgId, projectId, envId }) => {
    return getWithArgs(`/api/v1/envs/${envId}/output`, {}, { 
      'IaC-Org-Id': orgId, 
      'IaC-Project-Id': projectId 
    });
  },
  getVariables: ({ orgId, projectId, envId }) => {
    return getWithArgs(`/api/v1/envs/${envId}/variables`, {}, { 
      'IaC-Org-Id': orgId, 
      'IaC-Project-Id': projectId 
    });
  },
  // 创建环境
  createEnv: ({ orgId, projectId, ...resetParams }) => {
    return post(`/api/v1/envs`, { ...resetParams }, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  },
  // 环境合规详情
  result: ({ orgId, projectId, envId, ...restParams }) => {
    return getWithArgs(`/api/v1/envs/${envId}/policy_result`, restParams, { 
      'IaC-Org-Id': orgId, 
      'IaC-Project-Id': projectId 
    });
  },
  // 资源详情
  getResources: ({ orgId, projectId, envId, resourceId }) => {
    return getWithArgs(`/api/v1/envs/${envId}/resources/${resourceId}`, {}, { 
      'IaC-Org-Id': orgId, 
      'IaC-Project-Id': projectId 
    });
  },
  updateTag: ({ orgId, projectId, envId, ...resetParams }) => {
    return post(`/api/v1/envs/${envId}/tags`, { ...resetParams }, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  },

  // 锁定
  envLocked: ({ orgId, projectId, envId, ...resetParams }) => {
    return post(`/api/v1/envs/${envId}/lock`, { ...resetParams }, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  },
  // 解锁
  envUnLocked: ({ orgId, projectId, envId, ...resetParams }) => {
    return post(`/api/v1/envs/${envId}/unlock`, { ...resetParams }, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  },
  // 环境解锁确认
  unlockedConfirm: ({ envId, orgId, projectId }) => {
    return get(`/api/v1/envs/${envId}/unlock/confirm`, { 
      'IaC-Org-Id': orgId, 
      'IaC-Project-Id': projectId 
    });
  },
  deployCheck: ({ orgId, projectId, envId, ...resetParams }) => {
    return post(`/api/v1/envs/${envId}/deploy/check`, { ...resetParams }, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  }
};

export default envAPI;