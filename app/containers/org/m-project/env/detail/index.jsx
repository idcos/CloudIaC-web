import React, { useState, useEffect, useCallback } from 'react';
import history from 'utils/history';
import { connect } from 'react-redux';
import { Menu, notification, Tabs, Button } from "antd";

import { Eb_WP } from 'components/error-boundary';
import PageHeaderPlus from 'components/pageHeaderPlus';
import LayoutPlus from 'components/common/layout/plus';

import Info from './components/info';
import Resource from './components/resource';
import Deploy from './components/deploy';
import DeployHistory from './components/deployHistory';
import Variable from './components/variable';
import Setting from './components/setting';

import styles from './styles.less';

import { orgsAPI } from 'services/base';



const subNavs = {
  resource: '资源',
  deploy: '部署日志',
  deployHistory: '部署历史',
  variable: '变量',
  setting: '设置'
};

const OrgSetting = (props) => {
  const [ panel, setPanel ] = useState('resource');
  const { dispatch } = props;
  const renderByPanel = useCallback(() => {
    const PAGES = {
      resource: () => <Resource {...props}/>,
      deploy: () => <Deploy {...props}/>,
      deployHistory: () => <DeployHistory {...props}/>,
      variable: () => <Variable {...props}/>,
      setting: () => <Setting {...props}/>
    };
    return PAGES[panel]({
      title: subNavs[panel],
      dispatch
    });
  }, [panel]);

  return <LayoutPlus
    extraHeader={
      <PageHeaderPlus
        title={'环境名称'}
        subDes={<div><Button>重新部署</Button><Button style={{ marginLeft: 8 }} type={'primary'}>销毁资源</Button></div>}
        breadcrumb={true}
        // renderFooter={() => (
        //   <Tabs
        //     tabBarStyle={{ backgroundColor: '#fff', paddingLeft: 16 }}
        //     animated={false}
        //     renderTabBar={(props, DefaultTabBar) => {
        //       return (
        //         <div style={{ marginBottom: -16 }}>
        //           <DefaultTabBar {...props} />
        //         </div>
        //       );
        //     }}
        //     activeKey={panel}
        //     onChange={(k) => setPanel(k)}
        //   >
        //     {Object.keys(subNavs).map((it) => (
        //       <Tabs.TabPane
        //         tab={subNavs[it]}
        //         key={it}
        //       />
        //     ))}
        //   </Tabs>
        // )}
      />
    }
  >
    <div className='idcos-card'>
      <Info {...props} />
    </div>
    <div style={{ marginTop: 20 }} className='idcos-card'>
      <div className={styles.depolyDetail}>
        <Tabs
          type={'card'}
          tabBarStyle={{ backgroundColor: '#fff', marginBottom: 20 }}
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
        {renderByPanel()}

      </div>
    </div>
  </LayoutPlus>;
};

export default connect()(
  Eb_WP()(OrgSetting)
);
