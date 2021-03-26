import React, { useState, useCallback } from 'react';
import { Button, Tabs } from 'antd';

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';
import styles from "./styles.less";

import Overview from './detailPages/overview';
import Running from './detailPages/running';
import Setting from './detailPages/setting';
import State from './detailPages/state';
import Variable from './detailPages/variable';

const subNavs = {
  overview: '概述',
  running: '运行',
  state: '状态',
  variable: '变量',
  setting: '设置'
};

const CloudTmpDetail = (props) => {
  const { match } = props,
    { orgId, ctId } = match;
  const [ tab, setTabs ] = useState('overview');

  const renderByTab = useCallback(() => {
    const PAGES = {
      overview: () => <Overview/>,
      running: () => <Running/>,
      state: () => <Setting/>,
      variable: () => <State/>,
      setting: () => <Variable/>
    };
    return PAGES[tab]();
  }, [tab]);

  return <Layout
    extraHeader={<PageHeader
      title='云模板详情'
      breadcrumb={true}
      des={'123'}
      subDes={'123,123,123'}
      renderFooter={() => <Tabs
        tabBarExtraContent={<Button type='primary'>新建作业</Button>}
        renderTabBar={(props, DefaultTabBar) => {
          return <div style={{ marginBottom: -16 }}>
            <DefaultTabBar {...props}/>
          </div>;
        }}
        activeKe={tab}
        onChange={k => setTabs(k)}
      >
        {Object.keys(subNavs).map(it => <Tabs.TabPane tab={subNavs[it]} key={it}/>)}
      </Tabs>}
    />}
  >
    <div className='container-inner-width'>
      <div className={styles.ctDetail}>
        {renderByTab()}
      </div>
    </div>
  </Layout>;
};

export default Eb_WP()(CloudTmpDetail);
