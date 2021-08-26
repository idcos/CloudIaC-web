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
      path: '/org/:orgId/project/:projectId/:mProjectKey',
      name: '组织主页',
      component: loadable(() => import('containers/org'), asyncLoadFallback),
      routes: [
        {
          path: '/org/:orgId/project/:projectId/m-project-env',
          name: '项目信息：环境',
          component: loadable(() => import('containers/org/m-project/env'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/project/:projectId/m-project-env/deploy/:tplId/:envId?',
          name: '部署新环境：选择云模板',
          component: loadable(() => import('containers/org/m-project/env/deploy'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/project/:projectId/m-project-env/detail/:envId/:tabKey',
          //(resource,deploy,deployHistory,variable,setting)
          component: loadable(() => import('containers/org/m-project/env/detail'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/project/:projectId/m-project-env/detail/:envId/:tabKey/task/:taskId',
          component: loadable(() => import('containers/org/m-project/env/detail/task-detail'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/project/:projectId/m-project-ct',
          name: '项目信息：云模板',
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
      path: '/org/:orgId/:mOrgKey',
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
          component: loadable(() => import('containers/org/m-project/create'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/compliance-ct',
          name: '组织设置：项目',
          component: loadable(() => import('containers/org/compliance-config/ct'), asyncLoadFallback),
          exact: true
        }
      ]
    },
    {
      path: '/compliance',
      name: '合规配置',
      component: loadable(() => import('containers/compliance'), asyncLoadFallback),
      routes: [
        {
          path: '/compliance/compliance-config/ct',
          name: '云模板',
          component: loadable(() => import('containers/compliance/compliance-config/ct'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/compliance/compliance-config/env',
          name: '环境',
          component: loadable(() => import('containers/compliance/compliance-config/env'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/compliance/compliance-config/env/env-detail',
          name: '环境详情',
          component: loadable(() => import('containers/compliance/compliance-config/env/detail'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/compliance/strategy-config/strategy-group',
          name: '云模板',
          component: loadable(() => import('containers/compliance/strategy-config/strategy-group'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/compliance/strategy-config/strategy',
          name: '环境',
          component: loadable(() => import('containers/compliance/strategy-config/strategy'), asyncLoadFallback),
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
      name: '帮助文档',
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
