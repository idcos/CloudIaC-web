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
      path: '/:orgId/ct',
      name: '云模板',
      component: loadable(() => import('containers/orgs/ct'), asyncLoadFallback),
      exact: true
    },
    {
      path: '/:orgId/ct/createCT',
      name: '创建云模板',
      component: loadable(() => import('containers/orgs/ct/create'), asyncLoadFallback),
      exact: true
    },
    {
      path: '/:orgId/setting',
      name: '设置',
      component: loadable(() => import('containers/orgs/setting'), asyncLoadFallback),
      exact: true
    },
    {
      path: '/sys',
      name: '系统设置',
      component: loadable(() => import('containers/sys'), asyncLoadFallback),
      exact: true
    },
    {
      path: '/sys/status',
      name: '系统设置',
      component: loadable(() => import('containers/sys/status'), asyncLoadFallback),
      exact: true
    },
    {
      path: '/userLogin',
      name: '登录',
      component: loadable(() => import('containers/login'), asyncLoadFallback),
      exact: true
    },
    {
      path: '*',
      name: 'NotFoundPage',
      component: loadable(() => import('containers/NotFoundPage'), asyncLoadFallback)
    }
  ];
}
