import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const sysAPI = {
  sysStatus: () => {
    return get('/api/v1/systems/status');
  },
  updateTags: ({ tags, serviceId }) => {
    return put('/api/v1/consul/tags/update', {
      tags, serviceId
    });
  },
  listCTRunner: ({ orgId }) => {
    return get('/api/v1/runners', {
      'IaC-Org-Id': orgId
    });
  },
  paramsSearch: () => {
    return get('/api/v1/systems');
  },
  paramsUpdate: ({ sysId, ...restParams }) => {
    return put(`/api/v1/systems/${sysId}`, { ...restParams });
  }
};

export default sysAPI;