import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const ldapAPI = {
  ous: ({ orgId, ...restParams }) => {
    return getWithArgs('/api/v1/ldap/ous', restParams, {
      'IaC-Org-Id': orgId
    });
  },
  users: ({ orgId, ...restParams }) => {
    return getWithArgs('/api/v1/ldap/users', restParams, {
      'IaC-Org-Id': orgId
    });
  },
  addOrgUser: ({ orgId, ...restParams }) => {
    return post('/api/v1/ldap/auth/org_user', restParams, {
      'IaC-Org-Id': orgId
    });
  },
  addOrgOu: ({ orgId, ...restParams }) => {
    return post('/api/v1/ldap/auth/org_ou', restParams, {
      'IaC-Org-Id': orgId
    });
  },
  orgOus: ({ orgId, ...restParams }) => {
    return getWithArgs('/api/v1/ldap/org_ous', restParams, {
      'IaC-Org-Id': orgId
    });
  },
  delOrgOu: ({ orgId, ...restParams }) => {
    return del('/api/v1/ldap/org_ou', restParams, {
      'IaC-Org-Id': orgId
    });
  },
  updateOrgOu: ({ orgId, ...restParams }) => {
    return put('/api/v1/ldap/org_ou', restParams, {
      'IaC-Org-Id': orgId
    });
  },
  projectOus: ({ orgId, projectId, ...restParams }) => {
    return getWithArgs('/api/v1/ldap/project_ous', restParams, {
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId
    });
  },
  addProjectOu: ({ orgId, projectId, ...restParams }) => {
    return post('/api/v1/ldap/auth/project_ou', restParams, {
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId
    });
  },
  delProjectOu: ({ orgId, projectId, ...restParams }) => {
    return del('/api/v1/ldap/project_ou', restParams, {
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId
    });
  },
  updateProjectOu: ({ orgId, projectId, ...restParams }) => {
    return put('/api/v1/ldap/project_ou', restParams, {
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId
    });
  }
};

export default ldapAPI;