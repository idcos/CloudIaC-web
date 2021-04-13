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
      path: '/org/:orgId',
      name: '组织详情',
      component: loadable(() => import('containers/orgs/orgWrapper'), asyncLoadFallback),
      routes: [
        {
          path: '/org/:orgId/ct',
          name: '云模板',
          component: loadable(() => import('containers/orgs/ct'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/ct/createCT',
          name: '创建云模板',
          component: loadable(() => import('containers/orgs/ct/create'), asyncLoadFallback),
          exact: true
        },
        {
          path: '/org/:orgId/ct/detailCT/:ctId',
          name: '云模板详情',
          component: loadable(() => import('containers/orgs/ct/detail'), asyncLoadFallback),
          exact: true
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
      path: '*',
      name: 'NotFoundPage',
      component: loadable(() => import('containers/NotFoundPage'), asyncLoadFallback)
    }
  ];
}
