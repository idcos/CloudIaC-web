import React from 'react';

import { Breadcrumb } from 'antd';

import { Link } from 'react-router-dom';

/**
 * 分拣出location.pathname中的路由参数
 * @param routeParams
 * @param pathSnippet
 * @return {boolean}
 */
const isRouteParam = (routeParams, pathSnippet) =>
  Object.keys(routeParams).find(it => routeParams[it] === pathSnippet);

const breadcrumbNameMap = {
  org: '组织',
  ct: '云模板',
  setting: '设置',
  createCT: '创建云模板',
  ctLib: '云模板库',
  overview: '概览',
  running: '运行',
  state: '状态',
  variable: '变量',
  runningDetail: '运行详情'
};


const BreadcrumbWrapper = ({ location, params, externalData }) => {
  const pathSnippets = location.pathname.split('/')
    .filter(i => i)
    .filter(i => !!isRouteParam({ orgId: params.orgId, tplId: params.tplId }, i) || breadcrumbNameMap.hasOwnProperty(i));
  const extraBreadcrumbItems = pathSnippets.map((snippet, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const isLastOne = index == pathSnippets.length - 1;
    const linkText = breadcrumbNameMap.hasOwnProperty(snippet) ?
      breadcrumbNameMap[snippet] : null;
    return linkText ? (
      <Breadcrumb.Item key={url}>
        <Link
          to={index == 0 ? '/' : url}
          disabled={isLastOne || index == 1}
        >
          {linkText}
        </Link>
      </Breadcrumb.Item>
    ) : null;
  });
  return <div className='breadcrumbWrapper'>
    <Breadcrumb>{extraBreadcrumbItems}</Breadcrumb>
  </div>;
};


export default BreadcrumbWrapper;
