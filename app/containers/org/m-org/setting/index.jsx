import React, { useState, useEffect, useCallback } from 'react';
import { Menu, notification, Tabs } from 'antd';

import PageHeaderPlus from 'components/pageHeaderPlus';
import LayoutPlus from 'components/common/layout/plus';

import Orgs from './orgs';
import ApiToken from './api-token';
import UserRole from './user-role';
import Vcs from './vcs';
import Notification from './notification';

const subNavs = {
  orgs: '组织',
  apiToken: 'API Token',
  userRole: '用户角色',
  vcs: 'VCS',
  notification: '通知'
};

export default ({ routesParams = {} }) => {

  const { curOrg } = routesParams;
  const [ panel, setPanel ] = useState('orgs');

  const renderByPanel = useCallback(() => {
    const PAGES = {
      orgs: (props) => <Orgs {...props} />,
      apiToken: (props) => <ApiToken {...props} />,
      userRole: (props) => <UserRole {...props} />,
      vcs: (props) => <Vcs {...props} />,
      notification: (props) => <Notification {...props} />
    };
    return PAGES[panel]({
      title: subNavs[panel],
      curOrg
    });
  }, [panel]);

  return (
    <LayoutPlus
      extraHeader={<PageHeaderPlus
        title='设定'
        breadcrumb={true}
        renderFooter={() => (
          <Tabs
            tabBarStyle={{ backgroundColor: '#fff', paddingLeft: 16 }}
            animated={false}
            renderTabBar={(props, DefaultTabBar) => {
              return (
                <div style={{ marginBottom: -16 }}>
                  <DefaultTabBar {...props} />
                </div>
              );
            }}
            activeKey={panel}
            onChange={(k) => setPanel(k)}
          >
            {Object.keys(subNavs).map((it) => (
              <Tabs.TabPane
                tab={subNavs[it]}
                key={it}
              />
            ))}
          </Tabs>
        )}
      />}
    >
      <div className='idcos-card'>
        {renderByPanel()}
      </div>
    </LayoutPlus>
  );
};
