import React, { useState, useEffect, useCallback, useRef } from 'react';
import { connect } from 'react-redux';
import { notification, Tabs } from "antd";

import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import { END_ENV_STATUS_LIST } from "constants/types";
import { envAPI } from 'services/base';

import Info from './components/info';
import Resource from './components/resource';
import DeployJournal from './components/deployJournal';
import styles from './styles.less';

const subNavs = {
  deployJournal: '部署日志',
  resource: '资源'
};

const TaskDetail = (props) => {

  const { dispatch, match: { params: { orgId, projectId, envId } } } = props;

  const [ panel, setPanel ] = useState('deployJournal');
  const [ info, setInfo ] = useState({});

  const loopRef = useRef();

  const renderByPanel = useCallback(() => {
    const PAGES = {
      resource: () => <Resource {...props} info={info} />,
      deployJournal: () => <DeployJournal {...props} info={info} reload={fetchInfo}/>
    };
    return PAGES[panel]({
      title: subNavs[panel],
      dispatch
    });
  }, [ panel, info ]);

  useEffect(() => {
    fetchInfo();
    return () => {
      clearInterval(loopRef.current);
    };
  }, []);
  
  // 获取Info
  const fetchInfo = async () => {
    try {
      const res = await envAPI.envsInfo({
        orgId, projectId, envId
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      const data = res.result || {};
      setInfo(preInfo => {
        return data.status !== preInfo.status ? data : preInfo;
      });
      // 循环刷新详情数据
      if (END_ENV_STATUS_LIST.indexOf(data.status) === -1 && !loopRef.current) {
        loopRef.current = setInterval(fetchInfo, 1500);
      }
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };
  
  return <Layout
    extraHeader={
      <PageHeader
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
  </Layout>;
};

export default connect()(
  Eb_WP()(TaskDetail)
);
