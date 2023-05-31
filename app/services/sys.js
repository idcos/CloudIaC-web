import { get, post, put } from 'utils/xFetch2';

const sysAPI = {
  sysStatus: () => {
    return get('/api/v1/systems/status');
  },
  updateTags: ({ tags, serviceId }) => {
    return put('/api/v1/consul/tags/update', {
      tags,
      serviceId,
    });
  },
  listCTRunner: ({ orgId }) => {
    return get('/api/v1/runners', {
      'IaC-Org-Id': orgId,
    });
  },
  listCTRunnerTag: ({ orgId }) => {
    return get('/api/v1/runners/tags', {
      'IaC-Org-Id': orgId,
    });
  },
  paramsSearch: () => {
    return get('/api/v1/systems');
  },
  paramsUpdate: params => {
    return put('/api/v1/systems', params);
  },
  getRegistryAddr: () => {
    return get('/api/v1/system_config/registry/addr');
  },
  updateRegistryAddr: params => {
    return post('/api/v1/system_config/registry/addr', params);
  },
  getSysConfigSwitches: () => {
    return get('/api/v1/system_config/switches');
  },
};

export default sysAPI;
