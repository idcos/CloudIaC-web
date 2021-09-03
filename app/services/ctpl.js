import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const ctplAPI = {
  list: ({ orgId, projectId, ...restParams }) => {
    return getWithArgs('/api/v1/policies/templates', restParams, {
      'IaC-Org-Id': orgId
    });
  },
  create: ({ orgId, ...restParams }) => {
    return post('/api/v1/templates', restParams, {
      'IaC-Org-Id': orgId
    });
  },
  detail: ({ orgId, tplId }) => {
    return getWithArgs(`/api/v1/templates/${tplId}`, {}, {
      'IaC-Org-Id': orgId
    });
  },
  del: ({ orgId, tplId }) => {
    return del(`/api/v1/templates/${tplId}`, {}, {
      'IaC-Org-Id': orgId
    });
  },
  update: ({ orgId, tplId, ...restParams }) => {
    return put(`/api/v1/templates/${tplId}`, restParams, {
      'IaC-Org-Id': orgId
    });
  },
  listImportVars: ({ orgId, ...restParams }) => {
    return getWithArgs('/api/v1/templates/variables', restParams, {
      'IaC-Org-Id': orgId
    });
  }
};

export default ctplAPI;