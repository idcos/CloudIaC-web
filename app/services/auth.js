import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

export const userAPI = {
  info: () => {
    return get('/api/v1/auth/me');
  },
  updateSelf: ({ name, phone, oldPassword, newPassword, newbieGuide }) => {
    return put('/api/v1/users/self', {
      name, phone, oldPassword, newPassword, newbieGuide
    });
  }
};
