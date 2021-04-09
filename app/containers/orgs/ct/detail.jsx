import React, { useState, useCallback, useEffect } from 'react';
import { Button, notification, Tabs } from 'antd';

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';
import styles from "./styles.less";

import Overview from './detailPages/overview';
import Running from './detailPages/running';
import Setting from './detailPages/setting';
import State from './detailPages/state';
import Variable from './detailPages/variable';

import { ctAPI } from 'services/base';

const subNavs = {
  //overview: '概述',
  running: '运行',
  state: '状态',
  variable: '变量',
  setting: '设置'
};

const CloudTmpDetail = (props) => {
  const { match, routesParams } = props,
    { ctId } = match.params;
  const [ tab, setTabs ] = useState('running'),
    [ detailInfo, setDetailInfo ] = useState({});

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    try {
      const res = await ctAPI.detail({
        id: ctId,
        orgId: routesParams.curOrg.id
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setDetailInfo(res.result || {});
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const renderByTab = useCallback(() => {
    const PAGES = {
      overview: (props) => <Overview/>,
      running: (props) => <Running/>,
      state: (props) => <State/>,
      variable: (props) => <Variable {...props}/>,
      setting: (props) => <Setting {...props}/>
    };
    return PAGES[tab]({
      curOrg: routesParams.curOrg,
      ctId,
      detailInfo,
      reload: fetchInfo
    });
  }, [ tab, detailInfo ]);

  return <Layout
    extraHeader={<PageHeader
      title={detailInfo.name || '-'}
      breadcrumb={true}
      des={detailInfo.description}
      //subDes={'123,123,123'}
      renderFooter={() => <Tabs
        tabBarExtraContent={<Button type='primary'>新建作业</Button>}
        renderTabBar={(props, DefaultTabBar) => {
          return <div style={{ marginBottom: -16 }}>
            <DefaultTabBar {...props}/>
          </div>;
        }}
        activeKey={tab}
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
