import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

export const authAPI = {
  login: ({ email, password }) => {
    return post('/api/v1/auth/login', {
      email,
      password
    });
  },
  info: () => {
    return get('/api/v1/user/info/search');
  },
  update: ({ id, name, phone, oldPassword, newPassword, newbieGuide }) => {
    return put('/api/v1/user/self/update', {
      id, name, phone, oldPassword, newPassword, newbieGuide
    });
  }
};
