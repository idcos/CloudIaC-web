import React from 'react';
import { Descriptions, Tabs, Drawer } from 'antd';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import policiesAPI from 'services/policies';
import { POLICIES_SEVERITY_STATUS_ENUM } from 'constants/types';
import { t } from 'utils/i18n';
import FixSuggestion from './component/fix-suggestion';
import Report from './component/report';
import Suppress from './component/suppress';

const DetailDrawer = ({ id, visible, onClose, reloadPolicyList }) => {
  const { data: detailInfo = {}, refresh } = useRequest(
    () => requestWrapper(policiesAPI.detail.bind(null, id)),
    {
      ready: !!id,
    },
  );

  const reloadPolicyDetailAndList = () => {
    refresh();
    reloadPolicyList();
  };

  const TabPaneMap = [
    {
      key: 'report',
      tab: t('define.report'),
      children: <Report policyId={id} />,
    },
    {
      key: 'suppress',
      tab: t('define.scan.status.suppressed'),
      children: (
        <Suppress
          policyId={id}
          detailInfo={detailInfo}
          reloadPolicyDetailAndList={reloadPolicyDetailAndList}
        />
      ),
    },
    {
      key: 'fix-suggestion',
      tab: t('define.suggestion'),
      children: <FixSuggestion content={detailInfo.fixSuggestion} />,
    },
  ];

  return (
    <Drawer
      title={detailInfo.name || '-'}
      visible={visible}
      onClose={onClose}
      width={1000}
      bodyStyle={{ padding: 16 }}
    >
      <Descriptions
        column={3}
        labelStyle={{ width: 105, textAlign: 'right', display: 'block' }}
      >
        <Descriptions.Item label={t('policy.detection.info.field.severity')}>
          {POLICIES_SEVERITY_STATUS_ENUM[detailInfo.severity] || '-'}
        </Descriptions.Item>
        <Descriptions.Item label={`${t('define.policy')} ID`}>
          {detailInfo.id}
        </Descriptions.Item>
      </Descriptions>
      <Tabs type='card' className='idcos-tabs-card' animated={false}>
        {TabPaneMap.map(tabPaneProps => (
          <Tabs.TabPane {...tabPaneProps} />
        ))}
      </Tabs>
    </Drawer>
  );
};

export default DetailDrawer;
