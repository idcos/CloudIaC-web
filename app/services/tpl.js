import { get, post, put, del, getWithArgs, postFile } from 'utils/xFetch2';

const tplAPI = {
  list: ({ orgId, projectId, ...restParams }) => {
    return getWithArgs('/api/v1/templates', restParams, {
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId
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
  check: ({ orgId, ...restParams }) => {
    return post(`/api/v1/templates/checks`, restParams, {
      'IaC-Org-Id': orgId
    });
  },
  listImportVars: ({ orgId, vcsId, ...restParams }) => {
    return getWithArgs(`/api/v1/vcs/${vcsId}/repos/variables`, restParams, {
      'IaC-Org-Id': orgId
    });
  },
  autotfversion: ({ orgId, ...restParams }) => {
    return getWithArgs('/api/v1/templates/autotfversion', restParams, {
      'IaC-Org-Id': orgId
    });
  },
  listTfversions: ({ orgId }) => {
    return getWithArgs('/api/v1/templates/tfversions', {}, {
      'IaC-Org-Id': orgId
    });
  },
  // 导入云模版
  importTemplates: ({ orgId, file }) => {
    return postFile(`/api/v1/templates/import`, file, {
      'IaC-Org-Id': orgId
    });
  }
};

export default tplAPI;