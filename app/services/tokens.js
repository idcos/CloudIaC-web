import { post, put, del, getWithArgs } from 'utils/xFetch2';

const tokensAPI = {
  listToken: ({ orgId, ...restParams }) => {
    return getWithArgs('/api/v1/tokens', restParams, {
      'IaC-Org-Id': orgId,
    });
  },
  createToken: ({ orgId, projectId, ...restParams }) => {
    return post('/api/v1/tokens', restParams, {
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId,
    });
  },
  editToken: ({ orgId, id, ...restParams }) => {
    return put(`/api/v1/tokens/${id}`, restParams, {
      'IaC-Org-Id': orgId,
    });
  },
  delToken: ({ orgId, id }) => {
    return del(
      `/api/v1/tokens/${id}`,
      {},
      {
        'IaC-Org-Id': orgId,
      },
    );
  },
};

export default tokensAPI;
