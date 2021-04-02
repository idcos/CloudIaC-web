import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

export const getUserInfo = () => {
  return get('/api/v1/user/getUserInfo');
};
