import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const userAPI = {
  list: ({ orgId, projectId, ...restParams }) => {
    return getWithArgs('/api/v1/users', restParams, {
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId
    });
  }
};

export default userAPI;