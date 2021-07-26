import React, { useState, useCallback, useRef } from 'react';
import { Menu, Tabs } from 'antd';

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';
import { SettingOutlined } from '@ant-design/icons';


import Orgs from './pages/orgs';
import Params from './pages/params';

const subNavs = {
  org: '组织设置',
  params: '参数设置'
};

const Sys = () => {

  const [ panel, setPanel ] = useState('org');

  const renderByPanel = useCallback(() => {
    const PAGES = {
      org: (props) => <Orgs {...props}/>,
      params: (props) => <Params {...props}/>
    };
    return PAGES[panel]({
      title: subNavs[panel]
    });
  }, [panel]);

  return <Layout
    extraHeader={<PageHeader
      className='container-inner-width'
      title='系统设置'
      showIcon={'setting'}
      icons={<SettingOutlined />}
      breadcrumb={false}
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
    <div className='idcos-card container-inner-width'>
      {renderByPanel()}
    </div>
  </Layout>;
};

export default Eb_WP()(Sys);
