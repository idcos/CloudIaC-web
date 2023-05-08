import { post_nologin, get_nologin } from 'utils/xFetch2';

export const activationAPI = {
  activation: (params, opt) => {
    return post_nologin('/api/v1/activation', params, opt);
  },
  retry: opt => {
    return get_nologin('/api/v1/activation/expired/retry', opt);
  },
};
