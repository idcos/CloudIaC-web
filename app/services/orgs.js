import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const orgsAPI = {
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
  removeUser: ({ orgId, id }) => {
    return del(`/api/v1/orgs/${orgId}/users/${id}`, {}, {
      'IaC-Org-Id': orgId
    });
  },
  listResources: ({ orgId, ...restParams }) => {
    return getWithArgs(`/api/v1/orgs/resources`, restParams, {
      'IaC-Org-Id': orgId
    });
  },
};

export default orgsAPI;