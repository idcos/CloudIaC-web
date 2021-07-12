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
      path: '/org/:orgId/:orgMenuKey/:projectId/:projectMenuKey',
      name: '组织详情',
      component: loadable(() => import('containers/org'), asyncLoadFallback),
      routes: [
        {
          path: '/org/:orgId/ct',
          name: '云模板',
          component: loadable(() => import('containers/orgs/ct'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/ct/ctLib',
          name: '创建云模板',
          component: loadable(() => import('containers/orgs/ct/ctLib'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/ct/createCT',
          name: '创建云模板',
          component: loadable(() => import('containers/orgs/ct/create'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/ct/:ctId/:ctDetailTabKey',
          name: '云模板详情',
          component: loadable(() => import('containers/orgs/ct/detail'), asyncLoadFallback),
          routes: [
            {
              path: '/org/:orgId/ct/:ctId/overview',
              name: '概览',
              component: loadable(() => import('containers/orgs/ct/detailPages/overview'), asyncLoadFallback),
              exact: true
            },
            {
              path: '/org/:orgId/ct/:ctId/running',
              name: '运行',
              component: loadable(() => import('containers/orgs/ct/detailPages/running'), asyncLoadFallback),
              exact: true
            },
            {
              path: '/org/:orgId/ct/:ctId/running/runningDetail/:curTask',
              name: '运行详情',
              component: loadable(() => import('containers/orgs/ct/detailPages/running/task'), asyncLoadFallback),
              exact: true
            },
            {
              path: '/org/:orgId/ct/:ctId/state',
              name: '状态',
              component: loadable(() => import('containers/orgs/ct/detailPages/state'), asyncLoadFallback),
              exact: true
            },
            {
              path: '/org/:orgId/ct/:ctId/variable',
              name: '变量',
              component: loadable(() => import('containers/orgs/ct/detailPages/variable'), asyncLoadFallback),
              exact: true
            },
            {
              path: '/org/:orgId/ct/:ctId/setting',
              name: '设置',
              component: loadable(() => import('containers/orgs/ct/detailPages/setting'), asyncLoadFallback),
              exact: true
            }
          ]
        },
        {
          path: '/org/:orgId/setting',
          name: '设置',
          component: loadable(() => import('containers/orgs/setting'), asyncLoadFallback),
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
