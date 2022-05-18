import React from 'react';
import loadable from 'utils/loadable';

const asyncLoadFallback = {
  fallback: 'Loading......'
};

export default function createRoutes() {
  return [
    {
      path: '/',
      name: '组织',
      component: loadable(() => import('containers/org-select-page'), asyncLoadFallback),
      exact: true
    },
    {
      path: '/org/:orgId/compliance/:configKey?/:typeKey',
      name: '合规配置',
      component: loadable(() => import('containers/compliance'), asyncLoadFallback),
      routes: [
        {
          path: '/org/:orgId/compliance/dashboard',
          name: '仪表盘',
          component: loadable(() => import('containers/compliance/dashboard'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/compliance/compliance-config/ct',
          name: '云模板',
          component: loadable(() => import('containers/compliance/compliance-config/ct'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/compliance/compliance-config/env',
          name: '环境',
          component: loadable(() => import('containers/compliance/compliance-config/env'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/compliance/policy-config/policy-group',
          name: '策略组',
          component: loadable(() => import('containers/compliance/policy-config/policy-group'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/compliance/policy-config/policy-group/policy-group-form/:policyGroupId?',
          name: '策略组创建/编辑页',
          component: loadable(() => import('containers/compliance/policy-config/policy-group/form-page'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/compliance/policy-config/policy',
          name: '策略',
          component: loadable(() => import('containers/compliance/policy-config/policy'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/compliance/policy-config/policy/online-test/:policyId?',
          name: '在线测试',
          component: loadable(() => import('containers/compliance/policy-config/policy/online-test'), asyncLoadFallback),
          exact: true
        }
      ]
    },
    {
      path: '/org/:orgId/project/:projectId/:mProjectKey',
      name: '组织主页',
      component: loadable(() => import('containers/project'), asyncLoadFallback),
      routes: [
        {
          path: '/org/:orgId/project/:projectId/m-project-env',
          name: '项目信息：环境',
          component: loadable(() => import('containers/project/m-project/env'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/project/:projectId/m-project-env/deploy/:tplId/:envId?',
          name: '部署新环境：选择云模板',
          component: loadable(() => import('containers/project/m-project/env/deploy'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/project/:projectId/m-project-env/detail/:envId',
          //(resource,output,deploy,deployHistory,variable,setting)
          component: loadable(() => import('containers/project/m-project/env/detail'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/project/:projectId/m-project-env/detail/:envId/task/:taskId',
          component: loadable(() => import('containers/project/m-project/env/detail/task-detail'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/project/:projectId/m-project-ct',
          name: '项目信息：云模板',
          component: loadable(() => import('containers/project/m-project/ct'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/project/:projectId/m-project-variable',
          name: '项目信息：变量',
          component: loadable(() => import('containers/project/m-project/variable'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/project/:projectId/m-project-setting',
          name: '项目信息：设置',
          component: loadable(() => import('containers/project/m-project/setting'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/project/:projectId/m-project-overview',
          name: '概览',
          component: loadable(() => import('containers/project/m-project/overview'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/project/:projectId/m-project-resource',
          name: '资源发现',
          component: loadable(() => import('containers/project/m-project/resource-query'), asyncLoadFallback),
          exact: true
        },
      ]
    },
    {
      path: '/org/:orgId/:mOrgKey',
      name: '组织主页',
      component: loadable(() => import('containers/org'), asyncLoadFallback),
      routes: [
        {
          path: '/org/:orgId/m-org-resource',
          name: '资源发现',
          component: loadable(() => import('containers/org/m-org/resource-query'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/m-org-overview',
          name: '组织设置：概览',
          component: loadable(() => import('containers/org/m-org/overview'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/m-org-project',
          name: '组织设置：项目',
          component: loadable(() => import('containers/org/m-org/project'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/m-org-ct',
          name: '组织设置：云模板',
          component: loadable(() => import('containers/org/m-org/ct'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/m-org-ct/createCT',
          name: '新建云模板',
          component: loadable(() => import('containers/org/m-org/ct/create'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/m-org-ct/updateCT/:tplId',
          name: '编辑云模板',
          component: loadable(() => import('containers/org/m-org/ct/update'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/m-org-variable',
          name: '组织设置：变量',
          component: loadable(() => import('containers/org/m-org/variable'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/m-org-setting',
          name: '组织设置：设定',
          component: loadable(() => import('containers/org/m-org/setting'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/m-project-create',
          name: '项目信息：创建项目',
          component: loadable(() => import('containers/project/m-project/create'), asyncLoadFallback),
          exact: true
        }
      ]
    },
    {
      path: '/sys/setting',
      name: '系统设置',
      component: loadable(() => import('containers/sys'), asyncLoadFallback),
      exact: true
    },
    {
      path: '/sys/status',
      name: '系统状态',
      component: loadable(() => import('containers/sys/status'), asyncLoadFallback),
      exact: true
    },
    {
      path: '/user/setting',
      name: '用户设置',
      component: loadable(() => import('containers/user'), asyncLoadFallback),
      exact: true
    },
    {
      path: '/no-access',
      name: 'NoAccessPage',
      component: loadable(() => import('containers/no-access'), asyncLoadFallback)
    },
    {
      path: '*',
      name: 'NotFoundPage',
      component: loadable(() => import('containers/NotFoundPage'), asyncLoadFallback)
    }
  ];
}
