import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const keysAPI = {
  list: ({ orgId, ...restParams }) => {
    return getWithArgs('/api/v1/keys', restParams, {
      'IaC-Org-Id': orgId
    });
  },
  create: ({ orgId, ...restParams }) => {
    return post('/api/v1/keys', restParams, {
      'IaC-Org-Id': orgId
    });
  },
  detail: ({ orgId, keyId }) => {
    return getWithArgs(`/api/v1/keys/${keyId}`, {}, {
      'IaC-Org-Id': orgId
    });
  },
  del: ({ orgId, keyId }) => {
    return del(`/api/v1/keys/${keyId}`, {}, {
      'IaC-Org-Id': orgId
    });
  },
  update: ({ orgId, keyId, ...restParams }) => {
    return put(`/api/v1/keys/${keyId}`, restParams, {
      'IaC-Org-Id': orgId
    });
  }
};

export default keysAPI;
