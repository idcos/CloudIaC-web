import { getWithArgs } from 'utils/xFetch2';

const registryAPI = {
  policyGroups: params => {
    return getWithArgs('/api/v1/registry/policy_groups', params);
  },
  policyGroupVersions: params => {
    return getWithArgs('/api/v1/registry/policy_groups/versions', params);
  },
};

export default registryAPI;
