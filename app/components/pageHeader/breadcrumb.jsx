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
  'org': { text: '组织' },
  'project': { text: '项目', disabled: true },
  'm-org-project': { text: '组织设置：项目' },
  'm-org-ct': { text: '组织设置：云模版' },
  'm-org-variable': { text: '组织设置：变量' },
  'm-org-setting': { text: '组织设置：设定' },
  'm-project-create': { text: '项目信息：创建项目' },
  'm-project-env': { text: '项目信息：环境' },
  'm-project-ct': { text: '项目信息：云模版' },
  'm-project-variable': { text: '项目信息：变量' },
  'm-project-setting': { text: '项目信息：设置' },
  'createCT': { text: '新建云模版' },
  'updateCT': { text: '编辑云模版' },
  'deploy': { text: '部署新环境' },
  'task': { text: '部署历史' },
  'detail': { text: '环境详情', indexDiff: 2 }
};


const BreadcrumbWrapper = ({ location, params }) => {

  const pathSnippets = location.pathname.split('/')
    .filter(i => i)
    .filter(i => !!isRouteParam({ ...params }, i) || breadcrumbNameMap.hasOwnProperty(i));

  const extraBreadcrumbItems = pathSnippets.map((snippet, index) => {
    const link = breadcrumbNameMap.hasOwnProperty(snippet) ? breadcrumbNameMap[snippet] : null;
    if (!link) {
      return null;
    }
    const url = `/${pathSnippets.slice(0, index + 1 + (link.indexDiff || 0)).join('/')}`;
    const isLastOne = index == pathSnippets.length - 1;
    return (
      <Breadcrumb.Item key={url}>
        <Link
          to={index == 0 ? '/' : url}
          disabled={isLastOne || link.disabled}
        >
          {link.text}
        </Link>
      </Breadcrumb.Item>
    );
  });

  console.log(pathSnippets, extraBreadcrumbItems);

  return <div className='breadcrumbWrapper'>
    <Breadcrumb>{extraBreadcrumbItems}</Breadcrumb>
  </div>;
};


export default BreadcrumbWrapper;
