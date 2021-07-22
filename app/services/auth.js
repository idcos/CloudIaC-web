import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

export const userAPI = {
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
  }
};
