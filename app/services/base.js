import { get, post, put, del, getWithArgs } from 'utils/xFetch2';


export const orgsAPI = {
  list: ({ status, q } = {}) => {
    return getWithArgs('/api/v1/org/search', { status, q });
  }
};

export const ctAPI = {
  list: ({ orgId, pageNo, pageSize, name, taskStatus }) => {
    return getWithArgs('/api/v1/template/search', {
      taskStatus,
      q: name,
      pageSize,
      currentPage: pageNo
    }, {
      'IaC-Org-Id': orgId
    });
  },
  listRepo: ({ orgId, pageNo, pageSize, name }) => {
    return getWithArgs('/api/v1/gitlab/listRepos', {
      q: name,
      pageSize,
      currentPage: pageNo
    }, {
      'IaC-Org-Id': orgId
    });
  },
  listRepoBranch: ({ repoId, orgId }) => {
    return getWithArgs('/api/v1/gitlab/listBranches', {
      repoId
    }, {
      'IaC-Org-Id': orgId
    });
  },
  createCt: ({ orgId, name, description, repoId, repoAddr, repoBranch, saveState, varfile, timeout, vars, extra }) => {
    return post('/api/v1/template/create', {
      name, description, repoId, repoAddr, repoBranch, saveState, varfile, timeout, vars, extra
    }, {
      'IaC-Org-Id': orgId
    });
  }
};
