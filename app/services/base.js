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
  create: (params) => {
    return post('/api/v1/orgs', params);
  },
  update: ({ orgId, ...restParams }) => {
    return put(`/api/v1/orgs/${orgId}`, restParams);
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
  inviteUser: ({ orgId, name, email, phone, role }) => {
    return post(`/api/v1/orgs/${orgId}/users/invite`, {
      name, email, phone, role
    }, {
      'IaC-Org-Id': orgId
    });
  },
  changeOrgUserRole: ({ orgId, id: userId, role }) => {
    return put(`/api/v1/orgs/${orgId}/users/${userId}/role`, {
      role
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
    return del(`/api/v1/orgs/${orgId}/users/${id}`, {}, {
      'IaC-Org-Id': orgId
    });
  }
};

export const sysAPI = {
  listCTRunner: ({ orgId }) => {
    return get('/api/v1/runners', {
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
    return get('/api/v1/systems/status');
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

