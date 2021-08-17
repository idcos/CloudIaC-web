import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { notification, Tabs } from "antd";
import { useRequest } from 'ahooks';

import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import { END_TASK_STATUS_LIST } from "constants/types";
import taskAPI from 'services/task';
import { requestWrapper } from 'utils/request';

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

  const { data: taskInfo = {}, refresh, cancel: cancelLoop } = useRequest(
    () => requestWrapper(
      taskAPI.detail.bind(null, {
        orgId, projectId, taskId
      })
    ), 
    {
      ready: !!taskId,
      pollingInterval: 3000,
      pollingWhenHidden: false,
      onSuccess: (data) => {
        if (END_TASK_STATUS_LIST.indexOf(data.status) !== -1) {
          cancelLoop();
        }
      },
      onError: () => {
        cancelLoop();
      }
    }
  );

  const renderByPanel = useCallback(() => {
    const PAGES = {
      resource: () => <Resource {...props} type='task' taskId={taskId} taskInfo={taskInfo} />,
      deployJournal: () => <DeployJournal {...props} taskId={taskId} taskInfo={taskInfo} reload={refresh}/>,
      variable: () => <Variable type='task' {...props} taskInfo={taskInfo}/>
    };
    return PAGES[panel]({
      title: subNavs[panel],
      dispatch
    });
  }, [ panel, taskInfo ]);
  
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
