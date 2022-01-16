import React, { useState, useEffect, useCallback } from 'react';
import history from 'utils/history';
import { connect } from 'react-redux';
import { Menu, notification, Tabs } from "antd";

import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';

import Basic from './basic';
import User from './user';

const subNavs = {
  basic: '基本信息',
  user: '用户'
};

const ProjectSetting = ({ match, dispatch }) => {

  const { orgId, projectId } = match.params;

  const [ panel, setPanel ] = useState('basic');
  const renderByPanel = useCallback(() => {
    const PAGES = {
      basic: (props) => <Basic {...props}/>,
      user: (props) => <User {...props}/>
    };
    return PAGES[panel]({
      title: subNavs[panel],
      orgId, 
      projectId,
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
            tabBarStyle={{ backgroundColor: '#fff' }}
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
  </Layout>;
};

export default connect()(
  Eb_WP()(ProjectSetting)
);
