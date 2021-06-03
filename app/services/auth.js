import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

export const userAPI = {
  info: () => {
    return get('/api/v1/user/info/search');
  },
  update: ({ id, name, phone, oldPassword, newPassword }) => {
    return put('/api/v1/user/self/update', {
      id, name, phone, oldPassword, newPassword
    });
  }
};
