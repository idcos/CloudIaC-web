import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

export const orgsAPI = {
  list: ({ status, q, pageNo, pageSize } = {}) => {
    return getWithArgs('/api/v1/org/search', {
      status,
      q,
      pageSize,
      currentPage: pageNo
    });
  },
  detail: (id) => {
    return getWithArgs('/api/v1/org/detail', {
      id
    });
  },
  edit: ({ id, name, description, vcsType, vcsVersion, vcsAuthInfo, defaultRunnerServiceId, defaultRunnerAddr, defaultRunnerPort }) => {
    return put('/api/v1/org/update', {
      id, name, description, vcsType, vcsVersion, vcsAuthInfo, defaultRunnerServiceId, defaultRunnerAddr, defaultRunnerPort
    });
  },
  create: ({ 
    name, description, vcsType, vcsVersion, vcsAuthInfo, 
    defaultRunnerServiceId, defaultRunnerAddr, defaultRunnerPort 
  }) => {
    return post('/api/v1/org/create', {
      name, description, vcsType, vcsVersion, vcsAuthInfo,
      defaultRunnerServiceId, defaultRunnerAddr, defaultRunnerPort 
    });
  },
  changeStatus: ({ id, status }) => {
    return put('/api/v1/org/status/change', {
      id,
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
  notificationList: ({ orgId, pageNo, pageSize }) => {
    return getWithArgs('/api/v1/notification/search', {
      pageNo, pageSize
    }, {
      'IaC-Org-Id': orgId
    });
  },
  createNotification: ({ orgId, notificationType, eventType, userIds, cfgInfo }) => {
    return post('/api/v1/notification/create', {
      notificationType, eventType, userIds, cfgInfo
    }, {
      'IaC-Org-Id': orgId
    });
  },
  delNotification: ({ orgId, id }) => {
    return del('/api/v1/notification/delete', {
      id
    }, {
      'IaC-Org-Id': orgId
    });
  },
  listUser: ({ orgId, status, name, pageSize, pageNo }) => {
    return getWithArgs('/api/v1/user/search', {
      status,
      q: name,
      pageSize,
      currentPage: pageNo
    }, {
      'IaC-Org-Id': orgId
    });
  },
  addUser: ({ orgId, name, email, phone }) => {
    return post('/api/v1/user/create', {
      name, email, phone
    }, {
      'IaC-Org-Id': orgId
    });
  },
  editUser: ({ orgId, id, name, email, phone }) => {
    return put('/api/v1/user/update', {
      id, name, email, phone
    }, {
      'IaC-Org-Id': orgId
    });
  },
  resetUserPwd: ({ orgId, id }) => {
    return put('/api/v1/user/password/update', {
      id
    }, {
      'IaC-Org-Id': orgId
    });
  },
  removeUser: ({ orgId, id }) => {
    return put('/api/v1/org/user/delete', {
      id
    }, {
      'IaC-Org-Id': orgId
    });
  },
  createVcs: ({ orgId, name, vcsType, address, vcsToken, status }) => {
    return post('/api/v1/vcs/create', {
      status: status || 'enable',
      name, vcsType, address, vcsToken 
    }, {
      'IaC-Org-Id': orgId
    });
  },
  deleteVcs: ({ orgId, id }) => {
    return del('/api/v1/vcs/delete', {
      id
    }, {
      'IaC-Org-Id': orgId
    });
  },
  updateVcs: (param) => {
    const { orgId, id, name, vcsType, address, vcsToken, status } = param;
    return put('/api/v1/vcs/update', {
      status: status || 'enable',
      id, name, vcsType, address, vcsToken 
    }, {
      'IaC-Org-Id': orgId
    });
  },
  searchVcs: ({ orgId, pageSize, currentPage }) => {
    return getWithArgs('/api/v1/vcs/search', {
      status,
      pageSize,
      currentPage
    }, {
      'IaC-Org-Id': orgId
    });
  },
  searchEnableVcs: ({ orgId }) => {
    return getWithArgs('/api/v1/vcs/search', {
      status: 'enable'
    }, {
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
    return getWithArgs('/api/v1/vcs/branch/search', {
      repoId, vcsId
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
    return post('/api/v1/template/library/create', {
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
  }
};

export const sysAPI = {
  listToken: ({ pageNo, pageSize }) => {
    return getWithArgs('/api/v1/token/search', {
      pageSize,
      currentPage: pageNo
    });
  },
  createToken: () => {
    return post('/api/v1/token/create', {});
  },
  editToken: ({ id, description, status }) => {
    return put('/api/v1/token/update', {
      id, description, status
    });
  },
  delToken: (id) => {
    return del('/api/v1/token/delete', {
      id
    });
  },
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
