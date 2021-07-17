import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const projectAPI = {
  getUserOptions: ({ orgId, projectId }) => {
    return getWithArgs('/api/v1/projects/users', { 
      currentPage: 1,
      pageSize: 100000
    }, {
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
  }
};

export default projectAPI;