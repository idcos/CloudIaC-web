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

import { envAPI } from 'services/base';

const subNavs = {
  resource: '资源',
  deploy: '部署日志',
  deployHistory: '部署历史',
  variable: '变量',
  setting: '设置'
};

const EnvDetail = (props) => {
  const [ panel, setPanel ] = useState('resource');
  const { dispatch, match: { params: { orgId, projectId, envId } } } = props;
  const [ info, setInfo ] = useState({});
  const renderByPanel = useCallback(() => {
    const PAGES = {
      resource: () => <Resource {...props} taskId={info.lastTaskId} />,
      deploy: () => <Deploy {...props} taskId={info.lastTaskId} />,
      deployHistory: () => <DeployHistory {...props}/>,
      variable: () => <Variable {...props}/>,
      setting: () => <Setting {...props}/>
    };
    return PAGES[panel]({
      title: subNavs[panel],
      dispatch
    });
  }, [ panel, info.lastTaskId ]);

  useEffect(() => {
    fetchInfo();
  }, [panel]);
  
  // 获取Info
  const fetchInfo = async () => {
    try {
      const res = await envAPI.envsInfo({
        orgId, projectId, envId, status: panel
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setInfo(res.result || {});
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };
  
  const redeploy = async() => {
    history.push(`/org/${orgId}/project/${projectId}/m-project-env/deploy/${info.tplId}/${envId}`); 
  };

  const destroy = async() => {
    try {
      const res = await envAPI.envDestroy({ orgId, projectId, envId });
      if (res.code != 200) {
        throw new Error(res.message);
      }
    } catch (e) {
      notification.error({
        message: '操作失败',
        description: e.message
      });
    }
  };

  return <LayoutPlus
    extraHeader={
      <PageHeaderPlus
        title={info.name || ''}
        subDes={<div><Button onClick={redeploy}>重新部署</Button><Button onClick={destroy} style={{ marginLeft: 8 }} type={'primary'}>销毁资源</Button></div>}
        breadcrumb={true}
      />
    }
  >
    <div className='idcos-card'>
      <Info {...props} info={info} />
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
  Eb_WP()(EnvDetail)
);
