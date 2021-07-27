import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const envAPI = {
  // 环境列表
  envsList: ({ orgId, projectId, status }) => {
    let values = { 
      pageSize: 99999,
      currentPage: 1 };
    if (status == 'filed') {
      values.archived = true;
    } else {
      values.status = status;
    }
    return getWithArgs('/api/v1/envs', {
      ...values
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
  envsResourcesList: ({ envId, orgId, projectId, q }) => {
    return getWithArgs(`/api/v1/envs/${envId}/resources`, {
      pageSize: 99999,
      currentPage: 1,
      q
    }, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  },
  // 创建环境
  createEnv: ({ orgId, projectId, ...resetParams }) => {
    return post(`/api/v1/envs`, { ...resetParams }, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  }
};

export default envAPI;