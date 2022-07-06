import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

export const authAPI = {
  email: ({ email }) => {
    return getWithArgs('/api/v1/auth/email', {
      email: email
    }, { isEncodeParams: true });
  },
  reset: ({ password, token }) => {
    return put('/api/v1/auth/password/reset', {
      password: password
    }, { isEncodeParams: true }, { headers: { Authorization: token } });
  },
  sendEmail: ({ email }) => {
    return post('/api/v1/auth/password/reset/email', {
      email: email
    }, { isEncodeParams: true });
  },
  getSysConfigSwitches: () => {
    return get('/api/v1/system_config/switches');
  }
};
