import React, { useState, useCallback, useRef } from 'react';
import { Menu, Tabs } from 'antd';

import PageHeaderPlus from 'components/pageHeaderPlus';
import { Eb_WP } from 'components/error-boundary';
import LayoutPlus from 'components/common/layout/plus';


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

  return <LayoutPlus
    extraHeader={<PageHeaderPlus
      className='container-inner-width'
      title='系统设置'
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
  </LayoutPlus>;
};

export default Eb_WP()(Sys);
