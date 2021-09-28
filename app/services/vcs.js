import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const vcsAPI = {
  createVcs: ({ orgId, name, vcsType, address, vcsToken, status }) => {
    return post('/api/v1/vcs', {
      status: status || 'enable',
      name, vcsType, address, vcsToken 
    }, {
      'IaC-Org-Id': orgId
    });
  },
  deleteVcs: ({ orgId, id }) => {
    return del(`/api/v1/vcs/${id}`, {}, {
      'IaC-Org-Id': orgId
    });
  },
  updateVcs: ({ orgId, id, name, vcsType, address, vcsToken, status }) => {
    return put(`/api/v1/vcs/${id}`, {
      status: status || 'enable',
      name, vcsType, address, vcsToken 
    }, {
      'IaC-Org-Id': orgId
    });
  },
  searchVcs: ({ orgId, ...restParams }) => {
    return getWithArgs('/api/v1/vcs', restParams, {
      'IaC-Org-Id': orgId
    });
  },
  searchEnableVcs: ({ orgId }) => {
    return getWithArgs('/api/v1/vcs', {
      status: 'enable'
    }, {
      'IaC-Org-Id': orgId
    });
  },
  listRepo: ({ orgId, vcsId, ...restParams }) => {
    return getWithArgs(`/api/v1/vcs/${vcsId}/repo`, restParams, {
      'IaC-Org-Id': orgId
    });
  },
  listRepoBranch: ({ orgId, vcsId, ...restParams }) => {
    return getWithArgs(`/api/v1/vcs/${vcsId}/branch`, restParams, {
      'IaC-Org-Id': orgId
    });
  },
  listRepoTag: ({ orgId, vcsId, ...restParams }) => {
    return getWithArgs(`/api/v1/vcs/${vcsId}/tag`, restParams, {
      'IaC-Org-Id': orgId
    });
  },
  listPlaybook: ({ orgId, vcsId, ...restParams }) => {
    return getWithArgs(`/api/v1/vcs/${vcsId}/repos/playbook`, restParams, {
      'IaC-Org-Id': orgId
    });
  },
  listTfvars: ({ orgId, vcsId, ...restParams }) => {
    return getWithArgs(`/api/v1/vcs/${vcsId}/repos/tfvars`, restParams, {
      'IaC-Org-Id': orgId
    });
  },
  file: ({ orgId, vcsId, ...restParams }) => {
    return getWithArgs(`/api/v1/vcs/${vcsId}/file`, restParams, {
      'IaC-Org-Id': orgId
    });
  },
};

export default vcsAPI;