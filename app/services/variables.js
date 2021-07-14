import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const varsAPI = {
  search: ({ orgId, projectId, ...restParams }) => {
    return getWithArgs('/api/v1/variables', { ...restParams }, { 
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId
    });
  },
  update: ({ orgId, projectId, ...restParams }) => {
    return put('/api/v1/variables/batch', { ...restParams }, { 
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId
    });
  }
};

export default varsAPI;