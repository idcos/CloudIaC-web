import React, { useState, useEffect, useCallback } from 'react';
import { Descriptions, Tabs, Drawer } from "antd";
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import policiesAPI from 'services/policies';
import { POLICIES_SEVERITY_ENUM } from 'constants/types';
import Report from './component/report';
import styles from './style.less';

const TabPaneMap = [
  { key: 'error', tab: '错误', children: '错误' },
  { key: 'pb', tab: '屏蔽', children: '屏蔽' },
  { key: 'ck', tab: '参考', children: '参考' },
  { key: 'bb', tab: '报表', children: '报表' },
];

export default ({ id, visible, onClose }) => {

  const { data: detailInfo = {} } = useRequest(
    () => requestWrapper(
      policiesAPI.detail.bind(null, id)
    ),
    {
      ready: !!id,
    }
  );

  return (
    <Drawer
      title={detailInfo.name}
      visible={visible}
      onClose={onClose}
      width={750}
    >
      <Descriptions 
        column={3}
        labelStyle={{ width: 105, textAlign: 'right', display: 'block' }}
      >
        <Descriptions.Item label='严重性'>{POLICIES_SEVERITY_ENUM[detailInfo.severity] || '-'}</Descriptions.Item>
        <Descriptions.Item label='策略ID'>{detailInfo.id}</Descriptions.Item>
      </Descriptions>
      <Tabs 
        type='card'
        tabBarStyle={{ backgroundColor: '#fff', marginBottom: 20 }}
        animated={false}
        renderTabBar={(props, DefaultTabBar) => {
          return (
            <div style={{ marginBottom: -16 }}>
              <DefaultTabBar {...props} />
            </div>
          );
        }}
      >
        {
          TabPaneMap.map(tabPaneProps => <Tabs.TabPane {...tabPaneProps}/>)
        }
      </Tabs>
    </Drawer>
  );
};
