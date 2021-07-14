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
  'org': '组织',
  'm-org-project': '组织设置：项目',
  'm-org-ct': '组织设置：云模版',
  'm-org-variable': '组织设置：变量',
  'm-org-setting': '组织设置：设定',
  'm-project-env': '项目信息：环境',
  'm-project-ct': '项目信息：云模版',
  'm-project-variable': '项目信息：变量',
  'm-project-setting': '项目信息：设置',
  'createCT': '新建云模版',
  'deploy': '部署新环境'
};


const BreadcrumbWrapper = ({ location, params, externalData }) => {
  const pathSnippets = location.pathname.split('/')
    .filter(i => i)
    .filter(i => !!isRouteParam({ orgId: params.orgId, ctId: params.ctId }, i) || breadcrumbNameMap.hasOwnProperty(i));
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
