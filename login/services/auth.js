import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

export const authAPI = {
  login: ({ email, password }) => {
    return post('/api/v1/auth/login', {
      email,
      password
    });
  },
  info: () => {
    return get('/api/v1/auth/me');
  },
  updateSelf: ({ name, phone, oldPassword, newPassword, newbieGuide }) => {
    return put('/api/v1/users/self', {
      name, phone, oldPassword, newPassword, newbieGuide
    });
  },
  getSsoToken: () => {
    return post('/api/v1/sso/tokens', {});
  },
  getSysConfigSwitches: () => {
    return get('/api/v1/system_config/switches');
  }
};
