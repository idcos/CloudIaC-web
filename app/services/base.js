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
  edit: ({ id, name, description, vcsType, vcsVersion, vcsAuthInfo }) => {
    return put('/api/v1/org/update', {
      id, name, description, vcsType, vcsVersion, vcsAuthInfo
    });
  },
  create: ({ name, description, vcsType, vcsVersion, vcsAuthInfo }) => {
    return post('/api/v1/org/create', {
      name, description, vcsType, vcsVersion, vcsAuthInfo
    });
  },
  changeStatus: ({ id, status }) => {
    return put('/api/v1/org/changeStatus', {
      id,
      status
    });
  },
  resAccountList: ({ orgId, q, status, pageNo, pageSize }) => {
    return getWithArgs('/api/v1/resourceAccount/search', {
      q,
      status,
      pageSize,
      currentPage: pageNo
    }, {
      'IaC-Org-Id': orgId
    });
  },
  resAccountCreate: ({ orgId, name, description, params, ctServiceIds }) => {
    return post('/api/v1/resourceAccount/create', {
      name, description, params, ctServiceIds
    }, {
      'IaC-Org-Id': orgId
    });
  },
  resAccountDel: ({ orgId, id }) => {
    return del('/api/v1/resourceAccount/delete', {
      id
    }, {
      'IaC-Org-Id': orgId
    });
  },
  resAccountUpdate: ({ orgId, id, name, description, params, ctServiceIds, status }) => {
    return put('/api/v1/resourceAccount/update', {
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
    return put('/api/v1/user/userPassReset', {
      id
    }, {
      'IaC-Org-Id': orgId
    });
  },
  removeUser: ({ orgId, id }) => {
    return put('/api/v1/user/removeUserForOrg', {
      id
    }, {
      'IaC-Org-Id': orgId
    });
  }
};

export const ctAPI = {
  list: ({ orgId, pageNo, pageSize, name, taskStatus }) => {
    return getWithArgs('/api/v1/template/search', {
      taskStatus,
      q: name,
      pageSize,
      currentPage: pageNo
    }, {
      'IaC-Org-Id': orgId
    });
  },
  listRepo: ({ orgId, pageNo, pageSize, name }) => {
    return getWithArgs('/api/v1/gitlab/listRepos', {
      q: name,
      pageSize,
      currentPage: pageNo
    }, {
      'IaC-Org-Id': orgId
    });
  },
  listRepoBranch: ({ repoId, orgId }) => {
    return getWithArgs('/api/v1/gitlab/listBranches', {
      repoId
    }, {
      'IaC-Org-Id': orgId
    });
  },
  createCt: ({ orgId, name, description, repoId, repoAddr, repoBranch, saveState, varfile, timeout, vars, extra }) => {
    return post('/api/v1/template/create', {
      name, description, repoId, repoAddr, repoBranch, saveState, varfile, timeout, vars, extra
    }, {
      'IaC-Org-Id': orgId
    });
  },
  edit: ({ orgId, id, name, description, saveState, varfile, timeout, vars, extra, status }) => {
    return post('/api/v1/template/update', {
      id, name, description, saveState, varfile, timeout, vars, extra, status
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
  listCTRunner: () => {
    return get('/api/v1/runner_list/search');
  },
  getParams: () => {
    return get('/api/v1/system/search');
  },
  edit: (param) => {
    return put('/api/v1/system/update', {
      ...param
    });
  }
};
