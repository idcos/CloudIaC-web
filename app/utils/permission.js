// 定义用户角色权限
const getPermission = userInfo => {
  const { isAdmin, role: orgRole, projectRole } = userInfo || {};

  return {
    // 系统操作权限
    SYS_OPERATOR: isAdmin,
    // 组织设置权限
    ORG_SET: isAdmin || orgRole === 'admin',
    // 项目设置权限
    PROJECT_SET: isAdmin || orgRole === 'admin' || projectRole === 'manager',
    // 项目审批权限
    PROJECT_APPROVER:
      isAdmin ||
      orgRole === 'admin' ||
      projectRole === 'manager' ||
      projectRole === 'approver',
    // 项目操作权限
    PROJECT_OPERATOR:
      isAdmin ||
      orgRole === 'admin' ||
      projectRole === 'manager' ||
      projectRole === 'approver' ||
      projectRole === 'operator',
  };
};

export default getPermission;
