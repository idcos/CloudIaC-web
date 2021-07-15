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
      component: loadable(() => import('containers/orgs'), asyncLoadFallback),
      exact: true
    },
    {
      path: '/org/:orgId/:mOrgKey?/:projectId?/:mProjectKey?',
      name: '组织主页',
      component: loadable(() => import('containers/org'), asyncLoadFallback),
      routes: [
        {
          path: '/org/:orgId/m-org-project',
          name: '组织设置：项目',
          component: loadable(() => import('containers/org/m-org/project'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/m-org-ct',
          name: '组织设置：云模版',
          component: loadable(() => import('containers/org/m-org/ct'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/m-org-ct/createCT',
          name: '新建云模版',
          component: loadable(() => import('containers/org/m-org/ct/create'), asyncLoadFallback),
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
          path: '/org/:orgId/project/:projectId/m-project-env',
          name: '项目信息：环境',
          component: loadable(() => import('containers/org/m-project/env'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/project/:projectId/m-project-env/deploy',
          name: '部署新环境：选择云模板',
          component: loadable(() => import('containers/org/m-project/env/deploy'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/project/:projectId/m-project-env/detail/:envId',
          component: loadable(() => import('containers/org/m-project/env/detail'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/project/:projectId/m-project-env/detail/:envId/task/:taskId',
          component: loadable(() => import('containers/org/m-project/env/detail/task-detail'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/project/:projectId/m-project-ct',
          name: '项目信息：云模版',
          component: loadable(() => import('containers/org/m-project/ct'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/project/:projectId/m-project-variable',
          name: '项目信息：变量',
          component: loadable(() => import('containers/org/m-project/variable'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/project/:projectId/m-project-setting',
          name: '项目信息：设置',
          component: loadable(() => import('containers/org/m-project/setting'), asyncLoadFallback),
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
      path: '/devManual',
      name: '开发者手册',
      component: loadable(() => import('containers/devManual'), asyncLoadFallback),
      exact: true
    },
    {
      path: '*',
      name: 'NotFoundPage',
      component: loadable(() => import('containers/NotFoundPage'), asyncLoadFallback)
    }
  ];
}
