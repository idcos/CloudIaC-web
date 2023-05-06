import { put, getWithArgs } from 'utils/xFetch2';

const varsAPI = {
  search: ({ orgId, projectId, ...restParams }) => {
    return getWithArgs(
      '/api/v1/variables',
      { ...restParams },
      {
        'IaC-Org-Id': orgId,
        'IaC-Project-Id': projectId,
      },
    );
  },
  update: ({ orgId, projectId, scope, objectId, ...restParams }) => {
    return put(`/api/v1/variables/scope/${scope}/${objectId}`, restParams, {
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId,
    });
  },
};

export default varsAPI;
