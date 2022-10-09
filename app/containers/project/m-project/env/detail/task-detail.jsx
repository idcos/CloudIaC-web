import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { Tabs } from "antd";
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import { END_TASK_STATUS_LIST } from "constants/types";
import taskAPI from 'services/task';
import envAPI from 'services/env';
import Resource from './components/resource';
import Output from './components/output';
import DeployJournal from './components/deployJournal';
import Variable from './components/variable';
import TaskInfo from './components/taskInfo';
import ComplianceInfo from './components/compliance-info';
import DetailPageContext from './detail-page-context';
import { t } from 'utils/i18n';
import styles from './styles.less';

const subNavs = {
  deployJournal: t('task.deployLog.name'),
  resource: t('define.resource'),
  compInfo: t('policy.detection.complianceStatus'),
  output: 'Output',
  variable: t('define.variable')
};

const TaskDetail = (props) => {

  const { userInfo, dispatch, match: { params: { orgId, projectId, envId, taskId } } } = props;

  const [ panel, setPanel ] = useState('deployJournal');

  const { data: envInfo = {} } = useRequest(
    () => requestWrapper(
      envAPI.envsInfo.bind(null, {
        orgId, projectId, envId
      })
    ), 
    {
      ready: !!envId
    }
  );

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
        if (END_TASK_STATUS_LIST.indexOf(data.status) !== -1 && !data.aborting) {
          cancelLoop();
        }
      },
      onError: () => {
        cancelLoop();
      }
    }
  );

  const reload = () => {
    refresh();
  };

  const renderByPanel = useCallback(() => {
    const PAGES = {
      resource: () => <Resource />,
      output: () => <Output />,
      compInfo: () => <ComplianceInfo/>,
      deployJournal: () => <DeployJournal />,
      variable: () => <Variable />
    };
    return PAGES[panel]({
      title: subNavs[panel],
      dispatch
    });
  }, [ panel, taskInfo ]);
  
  return (
    <DetailPageContext.Provider
      value={{
        envInfo,
        userInfo,
        taskInfo,
        reload,
        envId,
        taskId,
        orgId, 
        projectId,
        type: 'task'
      }}
    >
      <Layout
        extraHeader={
          <PageHeader
            title={envInfo.name && envInfo.name.replace(' ', '\u00A0') || ''}
            breadcrumb={true}
          />
        }
      >
        <div className='idcos-card'>
          <TaskInfo taskInfo={taskInfo} />
        </div>
        <div style={{ marginTop: 20 }} className='idcos-card'>
          <div>
            <Tabs
              // type={'card'}
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
      </Layout>
    </DetailPageContext.Provider>
  );
};

export default connect(
  (state) => {
    return {
      userInfo: state.global.get('userInfo').toJS()
    };
  }
)(
  Eb_WP()(TaskDetail)
);
