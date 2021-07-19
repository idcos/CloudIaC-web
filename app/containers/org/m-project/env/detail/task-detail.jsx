import React, { useState, useEffect, useCallback } from 'react';
import history from 'utils/history';
import { connect } from 'react-redux';
import { Modal, notification, Tabs, Button, Form, Input } from "antd";
import { ExclamationCircleFilled } from '@ant-design/icons';

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
  deploy: '部署日志',
  resource: '资源'

};

const EnvDetail = (props) => {
  const { dispatch, match: { params: { orgId, projectId, envId, tabKey } } } = props;
  const [ panel, setPanel ] = useState(tabKey || 'deploy');
  const [form] = Form.useForm();
  const [ info, setInfo ] = useState({});
  const renderByPanel = useCallback(() => {
    const PAGES = {
      resource: () => <Resource {...props} lastTaskId={info.lastTaskId} />,
      deploy: () => <Deploy {...props} lastTaskId={info.lastTaskId} />
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
  
  return <LayoutPlus
    extraHeader={
      <PageHeaderPlus
        title={info.name || ''}
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
          onChange={(k) => {
            let stateObj = { tabKey: k };
            setPanel(k); 
            window.history.replaceState(null, null, `/org/${orgId}/project/${projectId}/m-project-env/detail/${envId}/${k}`);
          }}
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
