import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

export const orgsAPI = {
  list: ({ status, q, pageNo, pageSize } = {}) => {
    return getWithArgs('/api/v1/orgs', {
      status,
      q,
      pageSize,
      currentPage: pageNo
    });
  },
  allEnableOrgs: (params) => {
    return getWithArgs('/api/v1/orgs', {
      status: 'enable',
      pageSize: 100000,
      currentPage: 1,
      ...params
    });
  },
  detail: (id) => {
    return getWithArgs(`/api/v1/orgs/${id}`, {
      id
    });
  },
  edit: ({ id, name, description, vcsType, vcsVersion, vcsAuthInfo, defaultRunnerServiceId, defaultRunnerAddr, defaultRunnerPort }) => {
    return put('/api/v1/orgs', {
      id, name, description, vcsType, vcsVersion, vcsAuthInfo, defaultRunnerServiceId, defaultRunnerAddr, defaultRunnerPort
    });
  },
  create: ({ 
    name, description, vcsType, vcsVersion, vcsAuthInfo, 
    defaultRunnerServiceId, defaultRunnerAddr, defaultRunnerPort 
  }) => {
    return post('/api/v1/orgs', {
      name, description, vcsType, vcsVersion, vcsAuthInfo,
      defaultRunnerServiceId, defaultRunnerAddr, defaultRunnerPort 
    });
  },
  changeStatus: ({ id, status }) => {
    return put(`/api/v1/orgs/${id}/status`, {
      status
    });
  },
  resAccountList: ({ orgId, q, status, pageNo, pageSize }) => {
    return getWithArgs('/api/v1/resource/account/search', {
      q,
      status,
      pageSize,
      currentPage: pageNo
    }, {
      'IaC-Org-Id': orgId
    });
  },
  resAccountCreate: ({ orgId, name, description, params, ctServiceIds }) => {
    return post('/api/v1/resource/account/create', {
      name, description, params, ctServiceIds
    }, {
      'IaC-Org-Id': orgId
    });
  },
  resAccountDel: ({ orgId, id }) => {
    return del('/api/v1/resource/account/delete', {
      id
    }, {
      'IaC-Org-Id': orgId
    });
  },
  resAccountUpdate: ({ orgId, id, name, description, params, ctServiceIds, status }) => {
    return put('/api/v1/resource/account/update', {
      id, name, description, params, ctServiceIds, status
    }, {
      'IaC-Org-Id': orgId
    });
  },
  listUser: ({ orgId, status, name, pageSize, pageNo }) => {
    return getWithArgs(`/api/v1/users`, {
      status,
      q: name,
      pageSize,
      currentPage: pageNo
    }, {
      'IaC-Org-Id': orgId
    });
  },
  addUser: ({ orgId, name, email, phone }) => {
    return post('/api/v1/users', {
      name, email, phone
    }, {
      'IaC-Org-Id': orgId
    });
  },
  editUser: ({ orgId, id, name, email, phone }) => {
    return put(`/api/v1/users/${id}`, {
      name, email, phone
    }, {
      'IaC-Org-Id': orgId
    });
  },
  resetUserPwd: ({ orgId, id }) => {
    return post(`/api/v1/users/${id}/password/reset`, {}, {
      'IaC-Org-Id': orgId
    });
  },
  removeUser: ({ orgId, id }) => {
    return del(`/api/v1/users/${id}`, {}, {
      'IaC-Org-Id': orgId
    });
  }
};

export const ctAPI = {
  list: ({ orgId, pageNo, pageSize, name, status, taskStatus }) => {
    return getWithArgs('/api/v1/template/search', {
      taskStatus,
      status,
      q: name,
      pageSize,
      currentPage: pageNo
    }, {
      'IaC-Org-Id': orgId
    });
  },
  detail: ({ orgId, id }) => {
    return getWithArgs('/api/v1/template/detail', {
      id
    }, {
      'IaC-Org-Id': orgId
    });
  },
  overview: ({ orgId, id }) => {
    return getWithArgs('/api/v1/template/overview', {
      id
    }, {
      'IaC-Org-Id': orgId
    });
  },
  listRepo: ({ orgId, pageNo, pageSize, name, vcsId }) => {
    return getWithArgs('/api/v1/vcs/repo/search', {
      q: name,
      currentPage: pageNo,
      pageSize,
      vcsId
    }, {
      'IaC-Org-Id': orgId
    });
  },
  listRepoBranch: ({ repoId, orgId, vcsId }) => {
    return getWithArgs(`/api/v1/vcs/${vcsId}/branch`, {
      repoId
    }, {
      'IaC-Org-Id': orgId
    });
  },
  listRepoTag: ({ repoId, orgId, vcsId }) => {
    return getWithArgs(`/api/v1/vcs/${vcsId}/tag`, {
      repoId
    }, {
      'IaC-Org-Id': orgId
    });
  },
  createCt: ({ 
    orgId, name, description, repoId, repoAddr, repoBranch, saveState, varfile, timeout, 
    vars, extra, vcsId, defaultRunnerAddr, defaultRunnerPort, defaultRunnerServiceId
  }) => {
    return post('/api/v1/template/create', {
      name, description, repoId, repoAddr, repoBranch, saveState, varfile, timeout, vars, extra,
      vcsId, defaultRunnerAddr, defaultRunnerPort, defaultRunnerServiceId
    }, {
      'IaC-Org-Id': orgId
    });
  },
  edit: ({ 
    orgId, id, name, description, saveState, varfile, playbook, timeout, vars, extra, 
    status, defaultRunnerServiceId, defaultRunnerAddr, defaultRunnerPort
  }) => {
    return put('/api/v1/template/update', {
      id, name, description, saveState, varfile, playbook, timeout, vars, extra, 
      status, defaultRunnerServiceId, defaultRunnerAddr, defaultRunnerPort
    }, {
      'IaC-Org-Id': orgId
    });
  },
  delCT: ({ orgId, id }) => {
    return del('/api/v1/template/delete', {
      id
    }, {
      'IaC-Org-Id': orgId
    });
  },
  listTask: ({ orgId, templateId, name, status, pageSize, pageNo }) => {
    return getWithArgs('/api/v1/task/search', {
      templateId, name, status, pageSize, currentPage: pageNo
    }, {
      'IaC-Org-Id': orgId
    });
  },
  createTask: ({ orgId, vcsId, name, ctServiceIp, ctServicePort, ctServiceId, templateId, templateGuid, taskType }) => {
    return post('/api/v1/task/create', {
      vcsId, name, ctServiceIp, ctServicePort, ctServiceId, templateId, templateGuid, taskType
    }, {
      'IaC-Org-Id': orgId
    });
  },
  detailTask: ({ orgId, taskId }) => {
    return getWithArgs('/api/v1/task/detail', {
      taskId
    }, {
      'IaC-Org-Id': orgId
    });
  },
  latestTask: ({ orgId, templateId }) => {
    return getWithArgs('/api/v1/task/last', {
      templateId
    }, {
      'IaC-Org-Id': orgId
    });
  },
  pollingTask: ({ template_uuid, task_id, container_id, offset }) => {
    return post('/api/task/status', {
      template_uuid, task_id, container_id, offset
    });
  },
  taskComment: ({ orgId, taskId }) => {
    return getWithArgs('/api/v1/task/comment/search', {
      taskId
    }, {
      'IaC-Org-Id': orgId
    });
  },
  createTaskComment: ({ orgId, taskId, comment }) => {
    return post('/api/v1/task/comment/create', {
      taskId, comment
    }, {
      'IaC-Org-Id': orgId
    });
  },
  repoReadme: ({ orgId, repoId, branch, vcsId }) => {
    return getWithArgs('/api/v1/vcs/readme', {
      repoId, branch, vcsId
    }, {
      'IaC-Org-Id': orgId
    });
  },
  stateFile: ({ orgId, filePath }) => {
    return getWithArgs('/api/v1/consul/kv/search', {
      key: filePath
    }, {
      'IaC-Org-Id': orgId
    });
  },
  tfvars: ({ orgId, repoId, repoBranch, vcsId }) => {
    return getWithArgs('/api/v1/template/tfvars/search', {
      vcsId, repoId, repoBranch
    }, {
      'IaC-Org-Id': orgId
    });
  },
  // 云模版库
  ctLibSearch: ({ orgId, pageSize, currentPage }) => {
    return getWithArgs('/api/v1/template/library/search', {
      pageSize,
      currentPage
    }, {
      'IaC-Org-Id': orgId
    });
  },
  createCTByLib: ({ orgId, metaTemplateId, name }) => {
    return post('/api/v1/template/create', {
      metaTemplateId, name
    }, {
      'IaC-Org-Id': orgId
    });
  },
  webhookSearch: ({ orgId, tplGuid }) => {
    return getWithArgs('/api/v1/webhook/search', {
      tplGuid
    }, {
      'IaC-Org-Id': orgId
    });
  },
  webhookCreate: ({ orgId, tplGuid, action }) => {
    return post('/api/v1/webhook/create', {
      tplGuid, action
    }, {
      'IaC-Org-Id': orgId
    });
  },
  webhookDelete: ({ orgId, id }) => {
    return del('/api/v1/webhook/delete', {
      id
    }, {
      'IaC-Org-Id': orgId
    });
  },
  variableSearch: ({ orgId, repoId, repoBranch, vcsId }) => {
    return getWithArgs('/api/v1/template/variable/search', {
      repoId, repoBranch, vcsId
    }, {
      'IaC-Org-Id': orgId
    });
  },
  playbookSearch: ({ orgId, repoId, repoBranch, vcsId }) => {
    return getWithArgs('/api/v1/template/playbook/search', {
      repoId, repoBranch, vcsId
    }, {
      'IaC-Org-Id': orgId
    });
  },
  listState: ({ orgId, ...params }) => {
    return getWithArgs('/api/v1/template/state_list', params, {
      'IaC-Org-Id': orgId
    });
  }
};

export const sysAPI = {
  listCTRunner: ({ orgId }) => {
    return get('/api/v1/runner/search', {
      'IaC-Org-Id': orgId
    });
  },
  getParams: () => {
    return get('/api/v1/system/search');
  },
  edit: (param) => {
    return put('/api/v1/system/update', {
      ...param
    });
  },
  sysStatus: () => {
    return get('/api/v1/system/status/search');
  },
  updateTags: ({ tags, serviceId }) => {
    return put('/api/v1/consul/tags/update', {
      tags, serviceId
    });
  }
};

export const pjtAPI = {
  projectList: ({ pageNo, pageSize, orgId }) => {
    return getWithArgs('/api/v1/projects', {
      pageSize,
      currentPage: pageNo
    }, { 'IaC-Org-Id': orgId });
  },
  allEnableProjects: ({ orgId }) => {
    return getWithArgs('/api/v1/projects', {
      status: 'enable',
      pageSize: 100000,
      currentPage: 1
    }, { 'IaC-Org-Id': orgId });
  },
  userList: ({ orgId }) => {
    return getWithArgs('/api/v1/users', {
      pageSize: 99999,
      currentPage: 1
    }, { 'IaC-Org-Id': orgId });
  },
  createProject: ({ orgId, ...restParams }) => {
    return post('/api/v1/projects', { ...restParams }, { 'IaC-Org-Id': orgId });
  },
  editProject: ({ orgId, projectId, ...restParams }) => {
    return put(`/api/v1/projects/${projectId}`, { ...restParams }, { 'IaC-Org-Id': orgId });
  },
  detailProject: ({ projectId, orgId }) => {
    return get(`/api/v1/projects/${projectId}`, { 'IaC-Org-Id': orgId });
  }
};

export const envAPI = {
  envsList: ({ orgId, projectId }) => {
    return getWithArgs('/api/v1/envs', {
      pageSize: 99999,
      currentPage: 1
    }, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  },
  // 环境详情
  envsInfo: ({ envId, orgId, projectId }) => {
    return getWithArgs(`/api/v1/envs/${envId}`, {
    }, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  },
  // 环境详情
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
    return post(`/api/v1/envs/${envId}/destroy`, {}, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  },
  // 获取环境资源列表
  envsResourcesList: ({ envId, orgId, projectId, q }) => {
    return getWithArgs(`/api/v1/envs/${envId}/resources`, {
      pageSize: 99999,
      currentPage: 1,
      q
    }, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  },
  // terraform Output
  envsOutput: ({ orgId, projectId, taskId }) => {
    return getWithArgs(`/api/v1/tasks/${taskId}/output`, {
    }, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  },
  // 查找当前任务实时日志
  envsLastLog: ({ orgId, projectId, taskId }) => {
    return getWithArgs(`/api/v1/tasks/${taskId}/log/sse`, {
    }, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  },

  // 获取环境资源列表
  envsTaskList: ({ envId, orgId, projectId, q }) => {
    return getWithArgs(`/api/v1/envs/${envId}/tasks`, {
      pageSize: 99999,
      currentPage: 1,
      q
    }, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  },
  // 获取云模板详情
  templateDetail: ({ templateId, orgId, projectId, q }) => {
    return getWithArgs(`/api/v1/templates/${templateId}`, {
    }, { 'IaC-Org-Id': orgId });
  },
  // 获取云模板详情
  createEnv: ({ orgId, projectId, ...resetParams }) => {
    return post(`/api/v1/envs`, { ...resetParams }, { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId });
  },
  // 获取全量密钥
  keysList: ({ orgId }) => {
    return getWithArgs(`/api/v1/keys`, {
      pageSize: 99999,
      currentPage: 1
    }, { 'IaC-Org-Id': orgId });
  }
};

