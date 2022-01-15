import React, { useMemo } from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const KEY = 'global';

const breadcrumbNameMap = {
  'org': { text: '组织' },
  'project': { text: '项目', disabled: true },
  'm-org-project': { text: '组织设置：项目' },
  'm-org-ct': { text: '组织设置：云模板' },
  'm-org-variable': { text: '组织设置：变量' },
  'm-org-setting': { text: '组织设置：设定' },
  'm-project-create': { text: '项目信息：创建项目' },
  'm-project-env': { text: '项目信息：环境' },
  'm-project-ct': { text: '项目信息：云模板' },
  'm-project-variable': { text: '项目信息：变量' },
  'm-project-setting': { text: '项目信息：设置' },
  'm-other-resource': { text: '资源查询' },
  'createCT': { text: '新建云模板' },
  'updateCT': { text: '编辑云模板' },
  'deploy': { getText: ({ envId }) => envId ? '重新部署' : '部署新环境' },
  'task': { text: '部署历史' },
  'detail': { text: '环境详情', indexDiff: 1, search: '?tabKey=deployHistory' },
  'compliance-config': { text: '合规配置', disabled: true },
  'ct': { text: '云模板', disabled: true },
  'env': { text: '环境' },
  'env-detail': { text: '环境详情' },
  'policy-config': { text: '策略管理', disabled: true },
  'policy-group': { text: '策略组' },
  'policy-group-form': { getText: ({ policyGroupId }) => policyGroupId ? '编辑策略组' : '新建策略组' },
  'policy': { text: '策略' },
  'online-test': { text: '在线测试' }
};

const BreadcrumbWrapper = ({ location, params }) => {
  
  const pathSnippets = location.pathname.split('/').filter(it => it);

  const breadcrumbContent = useMemo(() => {
    const lastOne = pathSnippets.filter(it => breadcrumbNameMap.hasOwnProperty(it) && breadcrumbNameMap[it]).pop();
    return pathSnippets.map((snippet, index) => {
      const link = breadcrumbNameMap.hasOwnProperty(snippet) ? breadcrumbNameMap[snippet] : null;
      if (!link) {
        return null;
      }
      const { indexDiff, getText, text, disabled, search = '' } = link;
      const url = `/${pathSnippets.slice(0, index + 1 + (indexDiff || 0)).join('/')}${search}`;
      const isLastOne = snippet === lastOne;
      return (
        <Breadcrumb.Item key={url}>
          <Link
            to={index == 0 ? '/' : url}
            disabled={isLastOne || disabled}
          >
            {getText ? getText(params) : text}
          </Link>
        </Breadcrumb.Item>
      );
    }).filter(it => it);
  }, [pathSnippets]);

  return <div className='breadcrumbWrapper'>
    <Breadcrumb>{breadcrumbContent}</Breadcrumb>
  </div>;
};

export default connect(
  (state) => ({ 
    orgs: state[KEY].get('orgs').toJS(),
    curOrg: state[KEY].get('curOrg'),
    curProject: state[KEY].get('curProject'),
    userInfo: state[KEY].get('userInfo').toJS()
  })
)(BreadcrumbWrapper);
