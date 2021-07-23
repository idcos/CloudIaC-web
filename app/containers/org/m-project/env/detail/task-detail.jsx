import React, { useState, useEffect, useCallback, useRef } from 'react';
import { connect } from 'react-redux';
import { notification, Tabs } from "antd";

import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import { END_TASK_STATUS_LIST } from "constants/types";
import taskAPI from 'services/task';

import Resource from './components/resource';
import DeployJournal from './components/deployJournal';
import Variable from './components/variable';
import TaskInfo from './components/taskInfo';
import styles from './styles.less';

const subNavs = {
  deployJournal: '部署日志',
  resource: '资源',
  variable: '变量'
};

const TaskDetail = (props) => {

  const { curEnv, dispatch, match: { params: { orgId, projectId, envId, taskId } } } = props;

  const [ panel, setPanel ] = useState('deployJournal');
  const [ taskInfo, setTaskInfo ] = useState({});

  const loopRef = useRef();

  const renderByPanel = useCallback(() => {
    const PAGES = {
      resource: () => <Resource {...props} taskId={taskId} taskInfo={taskInfo} />,
      deployJournal: () => <DeployJournal {...props} taskId={taskId} taskInfo={taskInfo} reload={fetchTaskInfo}/>,
      variable: () => <Variable taskInfo={taskInfo}/>
    };
    return PAGES[panel]({
      title: subNavs[panel],
      dispatch
    });
  }, [ panel, taskInfo ]);

  useEffect(() => {
    return () => {
      clearInterval(loopRef.current);
    };
  }, []);

  useEffect(() => {
    if (taskId && !loopRef.current) {
      fetchTaskInfo();
      loopRef.current = setInterval(() => {
        fetchTaskInfo();
      }, 1500);
    }
  }, [taskId]);
  
  // 获取Info
  const fetchTaskInfo = async () => {
    try {
      const res = await taskAPI.detail({
        orgId, projectId, taskId
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      const data = res.result || {};
      setTaskInfo(data);
      if (END_TASK_STATUS_LIST.indexOf(data.status) !== -1) {
        clearInterval(loopRef.current);
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
        title={(curEnv || {}).name || ''}
        breadcrumb={true}
      />
    }
  >
    <div className='idcos-card'>
      <TaskInfo taskInfo={taskInfo} />
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

export default connect(
  (state) => {
    return {
      curEnv: state['global'].get('curEnv')
    };
  }
)(
  Eb_WP()(TaskDetail)
);
