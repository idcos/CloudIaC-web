import React from 'react';
import loadable from 'utils/loadable';

const asyncLoadFallback = {
  fallback: 'Loading......'
};

export default function createRoutes() {
  return [
    {
      path: '/test',
      name: '测试',
      component: loadable(() => import('containers/Test'), asyncLoadFallback),
      routes: [
        {
          path: '/test/sub1',
          name: 'sub1',
          component: loadable(() => import('containers/Test/routes/sub1'), asyncLoadFallback)
        },
        {
          path: '/test/sub2',
          name: 'sub2',
          component: loadable(() => import('containers/Test/routes/sub2'), asyncLoadFallback)
        }
      ]
    },
    {
      path: '/',
      name: 'HomePage',
      component: loadable(() => import('containers/HomePage'), asyncLoadFallback),
      exact: true
    },
    {
      path: '*',
      name: 'NotFoundPage',
      component: loadable(() => import('containers/NotFoundPage'), asyncLoadFallback)
    }
  ];
}
