import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const projectAPI = {
  createProject: ({ orgId, ...restParams }) => {
    return post('/api/v1/projects', { ...restParams }, { 'IaC-Org-Id': orgId });
  },
  editProject: ({ orgId, projectId, ...restParams }) => {
    return put(`/api/v1/projects/${projectId}`, { ...restParams }, { 'IaC-Org-Id': orgId });
  },
  detailProject: ({ projectId, orgId }) => {
    return get(`/api/v1/projects/${projectId}`, { 'IaC-Org-Id': orgId });
  },
  projectList: ({ orgId, ...restParams }) => {
    return getWithArgs('/api/v1/projects', restParams, { 'IaC-Org-Id': orgId });
  },
  allEnableProjects: ({ orgId }) => {
    return getWithArgs('/api/v1/projects', {
      status: 'enable',
      pageSize: 0
    }, { 'IaC-Org-Id': orgId });
  },
  getUserOptions: ({ orgId, projectId }) => {
    return get('/api/v1/projects/users', {
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId
    });
  },
  listResources: ({ orgId, projectId, ...restParams }) => {
    return getWithArgs(`/api/v1/projects/resources`, restParams, {
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId
    });
  },
  filters: ({ orgId, projectId }) => {
    return getWithArgs(`/api/v1/projects/resources/filters`, {}, {
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId
    });
  },
  listAuthUser: ({ orgId, projectId, ...restParams }) => {
    return getWithArgs('/api/v1/projects/authorization/users', restParams, {
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId
    });
  },
  createUser: ({ orgId, projectId, ...restParams }) => {
    return post('/api/v1/projects/users', restParams, {
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId
    });
  },
  updateUserRole: ({ orgId, projectId, userId, ...restParams }) => {
    return put(`/api/v1/projects/users/${userId}`, restParams, {
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId
    });
  },
  removeUser: ({ orgId, projectId, userId }) => {
    return del(`/api/v1/projects/users/${userId}`, {}, {
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId
    });
  },
  statistics: ({ orgId, projectId, ...restParams }) => {
    return getWithArgs(`/api/v1/projects/${projectId}/statistics`, restParams, {
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId
    });
  }
};

export default projectAPI;