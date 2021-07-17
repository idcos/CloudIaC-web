import React, { useState, useEffect, useCallback } from 'react';
import { Menu, notification, Tabs } from 'antd';

import PageHeaderPlus from 'components/pageHeaderPlus';
import LayoutPlus from 'components/common/layout/plus';

import ApiToken from './api-token';
import UserRole from './user-role';
import Vcs from './vcs';
import Ssh from './ssh';
import Notification from './notification';

const subNavs = {
  userRole: '用户角色',
  apiToken: 'API Token',
  vcs: 'VCS',
  ssh: 'ssh密钥',
  notification: '通知'
};

export default ({ match }) => {
  
  const { orgId } = match.params;
  const [ panel, setPanel ] = useState('userRole');

  const renderByPanel = useCallback(() => {
    const PAGES = {
      // orgs: (props) => <Orgs {...props} />,
      userRole: (props) => <UserRole {...props} />,
      apiToken: (props) => <ApiToken {...props} />,
      vcs: (props) => <Vcs {...props} />,
      ssh: (props) => <Ssh {...props} />,
      notification: (props) => <Notification {...props} />
    };
    return PAGES[panel]({
      title: subNavs[panel],
      orgId
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
