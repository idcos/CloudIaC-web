import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

export const userAPI = {
  info: () => {
    return get('/api/v1/user/getUserInfo');
  },
  update: ({ id, name, phone, oldPassword, newPassword }) => {
    return put('/api/v1/user/updateSelf', {
      id, name, phone, oldPassword, newPassword
    });
  }
};
