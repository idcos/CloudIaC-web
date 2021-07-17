import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const sysAPI = {
  paramsSearch: () => {
    return get('/api/v1/systems');
  },
  paramsUpdate: ({ sysId, ...restParams }) => {
    return put(`/api/v1/systems/${sysId}`, { ...restParams });
  }
};

export default sysAPI;