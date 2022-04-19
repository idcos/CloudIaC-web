import React, { useMemo } from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { t } from 'utils/i18n';

const KEY = 'global';

const breadcrumbNameMap = {
  'org': { text: t('define.scope.org') },
  'project': { text: t('define.scope.project'), disabled: true },
  'm-org-project': { text: `${t('define.orgSet')}: ${t('define.scope.project')}` },
  'm-org-ct': { text: `${t('define.orgSet')}: ${t('define.scope.template')}` },
  'm-org-variable': { text: `${t('define.orgSet')}: ${t('define.variable')}` },
  'm-org-setting': { text: `${t('define.orgSet')}: ${t('define.setting')}` },
  'm-project-create': { text: `${t('define.projectInfo')}: ${t('define.createProject')}` },
  'm-project-env': { text: `${t('define.projectInfo')}: ${t('define.scope.env')}` },
  'm-project-ct': { text: `${t('define.projectInfo')}: ${t('define.scope.template')}` },
  'm-project-variable': { text: `${t('define.projectInfo')}: ${t('define.variable')}` },
  'm-project-setting': { text: `${t('define.projectInfo')}: ${t('define.setting')}` },
  'm-org-resource': { text: t('define.resourceQuery') },
  'm-project-overview': { text: t('define.projectOverview') },
  'm-org-overview': { text: t('define.orgOverview') },
  'createCT': { text: t('define.addTemplate') },
  'updateCT': { text: t('define.modifyTemplate') },
  'deploy': { 
    render: ({ params, isLastOne, url, index }) => {
      const { envId, orgId, projectId } = params;
      if (!envId) {
        return (
          <Breadcrumb.Item key={url}>
            <Link
              to={index == 0 ? '/' : url}
              disabled={isLastOne}
            >
              {t('define.deployEnv')}
            </Link>
          </Breadcrumb.Item>
        );
      } else {
        const envDetailUrl = `/org/${orgId}/project/${projectId}/m-project-env/detail/${envId}`;
        return (
          <>
            <Breadcrumb.Item key={envDetailUrl}>
              <Link
                to={envDetailUrl}
              >
                {t('define.envDetail')}
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item key={url}>
              <Link
                to={index == 0 ? '/' : url}
                disabled={isLastOne}
              >
                {t('define.redeployment')}
              </Link>
            </Breadcrumb.Item>
          </>
        );
      }
    }
  },
  'task': { text: t('define.deployHistory') },
  'detail': { text: t('define.envDetail'), indexDiff: 1, search: '?tabKey=deployHistory' },
  'compliance-config': { text: t('define.complianceConfig'), disabled: true },
  'ct': { text: t('define.scope.template'), disabled: true },
  'env': { text: t('define.scope.env') },
  'env-detail': { text: t('define.envDetail') },
  'policy-config': { text: t('define.policyManagement'), disabled: true },
  'policy-group': { text: t('define.policyGroup') },
  'policy-group-form': { getText: ({ policyGroupId }) => policyGroupId ? t('define.modifyPolicyGroup') : t('define.addPolicyGroup') },
  'policy': { text: t('define.policy') },
  'online-test': { text: t('define.onlineTest') }
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
      const { indexDiff, getText, text, disabled, render, search = '' } = link;
      const url = `/${pathSnippets.slice(0, index + 1 + (indexDiff || 0)).join('/')}${search}`;
      const isLastOne = snippet === lastOne;
      return render ? render({ index, params, isLastOne, url }) : (
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
