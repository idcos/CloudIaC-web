import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

export const registerAPI = {
  register: ({ email, password, name }) => {
    return post('/api/v1/auth/register', {
      email,
      name,
      password
    });
  },
  email: ({ email }) => {
    return getWithArgs('/api/v1/auth/email', {
      email: email
    }, { isEncodeParams: true });
  },
  retry: ({ email }) => {
    return getWithArgs('/api/v1/activation/retry', {
      email: email
    }, { isEncodeParams: true });
  }
};
