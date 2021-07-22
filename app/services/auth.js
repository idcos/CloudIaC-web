import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

export const userAPI = {
  info: (orgId = '') => {
    return get('/api/v1/auth/me', { 
      'IaC-Org-Id': orgId
    });
  },
  updateSelf: ({ name, phone, oldPassword, newPassword, newbieGuide }) => {
    return put('/api/v1/users/self', {
      name, phone, oldPassword, newPassword, newbieGuide
    });
  }
};
