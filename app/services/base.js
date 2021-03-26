import { get, post, put, del, getWithArgs } from 'utils/xFetch2';


export const orgsAPI = {
  list: () => {
    return getWithArgs('/xxx/xxx');
  }
};

export const ctAPI = {
  list: (params) => {
    return getWithArgs('/1/xxx', { ...params });
  }
};
