import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const userAPI = {
  info: ({ orgId, projectId } = {}) => {
    return get('/api/v1/auth/me', { 
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId
    });
  },
  updateSelf: ({ name, phone, oldPassword, newPassword, newbieGuide }) => {
    return put('/api/v1/users/self', {
      name, phone, oldPassword, newPassword, newbieGuide
    });
  },
  list: ({ orgId, projectId, ...restParams }) => {
    return getWithArgs('/api/v1/users', restParams, {
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId
    });
  },
  resetUserPwd: ({ orgId, id }) => {
    return post(`/api/v1/users/${id}/password/reset`, {}, {
      'IaC-Org-Id': orgId
    });
  }
};

export default userAPI;