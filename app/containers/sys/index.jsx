import React, { useState, useCallback, useRef } from 'react';
import { Menu, Tabs } from 'antd';
import { connect } from "react-redux";
import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';
import { SettingOutlined } from '@ant-design/icons';
import { t } from 'utils/i18n';
import Orgs from './pages/orgs';
import Params from './pages/params';
import Registry from './pages/registry';


const subNavs = {
  org: {
    title: t('define.orgSet'),
    needAdmin: false
  },
  params: {
    title: t('define.page.sysSet.params'),
    needAdmin: true
  },
  registry: {
    title: t('define.page.sysSet.registry'),
    needAdmin: true
  }
};

const Sys = ({ userInfo }) => {
  const [ panel, setPanel ] = useState('org');
  const renderByPanel = useCallback(() => {
    const PAGES = {
      org: (props) => <Orgs {...props}/>,
      params: (props) => <Params {...props}/>,
      registry: (props) => <Registry {...props}/>
    };
    return PAGES[panel]({
      title: subNavs[panel].title
    });
  }, [panel]);

  return <Layout
    extraHeader={<PageHeader
      className='container-inner-width'
      title={t('define.sysSet')}
      showIcon={'setting'}
      icons={<SettingOutlined />}
      breadcrumb={false}
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
              tab={subNavs[it].title}
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

export default connect(
  (state) => ({
    userInfo: state['global'].get('userInfo').toJS()
  })
)(Eb_WP()(Sys));
