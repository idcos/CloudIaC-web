import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

export const authAPI = {
  login: ({ email, password }) => {
    return post('/api/v1/auth/login', {
      email,
      password
    });
  }
};
