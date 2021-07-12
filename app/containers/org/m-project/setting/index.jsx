import React, { useState, useEffect, useCallback } from 'react';
import history from 'utils/history';
import { connect } from 'react-redux';
import { Menu, notification, Tabs } from "antd";

import { Eb_WP } from 'components/error-boundary';
import PageHeaderPlus from 'components/pageHeaderPlus';
import LayoutPlus from 'components/common/layout/plus';

import { orgsAPI } from 'services/base';

import styles from './styles.less';

import Basic from './components/basic';
import User from './components/user';

const subNavs = {
  basic: '基本信息',
  user: '用户'
};

const OrgSetting = ({ routesParams, dispatch }) => {
  const [ panel, setPanel ] = useState('user');
  const renderByPanel = useCallback(() => {
    const PAGES = {
      basic: (props) => <Basic {...props}/>,
      user: (props) => <User {...props}/>
    };
    return PAGES[panel]({
      title: subNavs[panel],
      dispatch
    });
  }, [panel]);

  return <LayoutPlus
    extraHeader={
      <PageHeaderPlus
        title={'设置'}
        breadcrumb={true}
        renderFooter={() => (
          <Tabs
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
      />
    }
  >
    <div className='idcos-card'>
      {renderByPanel()}
    </div>
  </LayoutPlus>;
};

export default connect()(
  Eb_WP()(OrgSetting)
);
