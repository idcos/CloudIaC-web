import React, { useState, useEffect, useCallback } from 'react';
import history from 'utils/history';
import { connect } from 'react-redux';
import { Menu, notification, Tabs } from "antd";

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';

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

  return <Layout
    extraHeader={
      <PageHeader
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
    <div className='container-inner-width'>
      <div className={styles.setting}>
        <div className='rightPanel'>
          {renderByPanel()}
        </div>
      </div>
    </div>
  </Layout>;
};

export default connect()(
  Eb_WP()(OrgSetting)
);
