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
      path: '/org/:orgGuid/:mOrgKey/:projectId?/:mProjectKey?',
      name: '组织主页',
      component: loadable(() => import('containers/org'), asyncLoadFallback),
      routes: [
        {
          path: '/org/:orgGuid/m-org-project',
          name: '组织设置：项目',
          component: loadable(() => import('containers/org/m-org/project'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgGuid/m-org-ct',
          name: '组织设置：云模版',
          component: loadable(() => import('containers/org/m-org/ct'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgGuid/m-org-variable',
          name: '组织设置：变量',
          component: loadable(() => import('containers/org/m-org/variable'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgGuid/m-org-setting',
          name: '组织设置：设定',
          component: loadable(() => import('containers/org/m-org/setting'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgGuid/project/:projectId/m-project-env',
          name: '项目信息：环境',
          component: loadable(() => import('containers/org/m-project/env'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgGuid/project/:projectId/m-project-ct',
          name: '项目信息：云模版',
          component: loadable(() => import('containers/org/m-project/ct'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgGuid/project/:projectId/m-project-variable',
          name: '项目信息：变量',
          component: loadable(() => import('containers/org/m-project/variable'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgGuid/project/:projectId/m-project-setting',
          name: '项目信息：设置',
          component: loadable(() => import('containers/org/m-project/setting'), asyncLoadFallback),
          exact: true
        }
        // {
        //   path: '/org/:orgId/ct',
        //   name: '云模板',
        //   component: loadable(() => import('containers/orgs/ct'), asyncLoadFallback),
        //   exact: true
        // },
        // {
        //   path: '/org/:orgId/ct/ctLib',
        //   name: '创建云模板',
        //   component: loadable(() => import('containers/orgs/ct/ctLib'), asyncLoadFallback),
        //   exact: true
        // },
        // {
        //   path: '/org/:orgId/ct/createCT',
        //   name: '创建云模板',
        //   component: loadable(() => import('containers/orgs/ct/create'), asyncLoadFallback),
        //   exact: true
        // },
        // {
        //   path: '/org/:orgId/ct/:ctId/:ctDetailTabKey',
        //   name: '云模板详情',
        //   component: loadable(() => import('containers/orgs/ct/detail'), asyncLoadFallback),
        //   routes: [
        //     {
        //       path: '/org/:orgId/ct/:ctId/overview',
        //       name: '概览',
        //       component: loadable(() => import('containers/orgs/ct/detailPages/overview'), asyncLoadFallback),
        //       exact: true
        //     },
        //     {
        //       path: '/org/:orgId/ct/:ctId/running',
        //       name: '运行',
        //       component: loadable(() => import('containers/orgs/ct/detailPages/running'), asyncLoadFallback),
        //       exact: true
        //     },
        //     {
        //       path: '/org/:orgId/ct/:ctId/running/runningDetail/:curTask',
        //       name: '运行详情',
        //       component: loadable(() => import('containers/orgs/ct/detailPages/running/task'), asyncLoadFallback),
        //       exact: true
        //     },
        //     {
        //       path: '/org/:orgId/ct/:ctId/state',
        //       name: '状态',
        //       component: loadable(() => import('containers/orgs/ct/detailPages/state'), asyncLoadFallback),
        //       exact: true
        //     },
        //     {
        //       path: '/org/:orgId/ct/:ctId/variable',
        //       name: '变量',
        //       component: loadable(() => import('containers/orgs/ct/detailPages/variable'), asyncLoadFallback),
        //       exact: true
        //     },
        //     {
        //       path: '/org/:orgId/ct/:ctId/setting',
        //       name: '设置',
        //       component: loadable(() => import('containers/orgs/ct/detailPages/setting'), asyncLoadFallback),
        //       exact: true
        //     }
        //   ]
        // },
        // {
        //   path: '/org/:orgId/setting',
        //   name: '设置',
        //   component: loadable(() => import('containers/orgs/setting'), asyncLoadFallback),
        //   exact: true
        // },
       
        // {
        //   path: '/org/:orgId/project/:projectId/setting',
        //   name: '设置',
        //   component: loadable(() => import('containers/orgs/project/setting'), asyncLoadFallback),
        //   exact: true
        // },
        // {
        //   path: '/org/:orgId/project/:projectId/variable',
        //   name: '变量',
        //   component: loadable(() => import('containers/orgs/project/variable'), asyncLoadFallback),
        //   exact: true
        // }
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
