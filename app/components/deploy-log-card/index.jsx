import React, { useState, useRef } from "react";
import { Card, Space, Button, Tag, Collapse, Input } from "antd";
import { CloseCircleFilled, CheckCircleFilled, SyncOutlined, FullscreenExitOutlined, FullscreenOutlined, SearchOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import { useRequest, useFullscreen } from 'ahooks';
import { requestWrapper } from 'utils/request';
import getPermission from "utils/permission";
import { TASK_STATUS, TASK_STATUS_COLOR, END_TASK_STATUS_LIST } from 'constants/types';
import envAPI from 'services/env';
import taskAPI from 'services/task';
import history from 'utils/history';
import { timeUtils } from "utils/time";
import SearchByKeyWord from 'components/coder/ansi-coder-card/dom-event';
import DeployLog from './deploy-log';
import styles from './styles.less';
import classnames from "classnames";

const { Panel } = Collapse;
const searchService = new SearchByKeyWord({ 
  searchWrapperSelect: '.ansi-coder-content',
  excludeSearchClassNameList: [
    'line-index'
  ]
});

const DeployLogCard = ({ taskInfo, userInfo, reload }) => {

  const searchRef = useRef();
  const ref = useRef();
  const [ isFullscreen, { toggleFull } ] = useFullscreen(ref);
  const { orgId, projectId, envId, id: taskId, startAt, endAt, type, status } = taskInfo || {};
  const { PROJECT_OPERATOR, PROJECT_APPROVER } = getPermission(userInfo);
  const [ activeKey, setActiveKey ] = useState();
 
  // 任务步骤列表查询
  const {
    data: taskSteps = [],
    cancel: cancelLoop,
    run: runLoop
  } = useRequest(
    () => requestWrapper(
      taskAPI.getTaskSteps.bind(null, { orgId, projectId, taskId })
    ),
    {
      formatResult: res => res || [],
      ready: !!taskId,
      pollingInterval: 3000,
      pollingWhenHidden: false,
      onSuccess: (data) => {
        let activeKey;
        // 获取最后一个有日志输出的步骤
        data.forEach((item) => {
          switch (item.status) {
            case 'complete':
            case 'failed':
            case 'running':
              activeKey = item.id;
              break;
            default:
              break;
          }
        });
        setActiveKey(activeKey);
        if (END_TASK_STATUS_LIST.includes(status)) {
          cancelLoop();
        }
      }
    }
  );

  // 执行部署
  const {
    run: applyTask,
    loading: applyTaskLoading
  } = useRequest(
    () => requestWrapper(
      envAPI.envRedeploy.bind(null, { orgId, projectId, envId, taskType: 'apply' }),
      {
        autoSuccess: true
      }
    ),
    {
      manual: true,
      onSuccess: (data) => {
        const { taskId } = data;
        history.push(`/org/${orgId}/project/${projectId}/m-project-env/detail/${envId}/deployHistory/task/${taskId}`); 
      }
    }
  ); 

  // 审批操作
  const {
    run: passOrRejecy,
    fetches: {
      approved: { loading: approvedLoading = false } = {},
      rejected: { loading: rejectedLoading = false } = {},
    } 
  } = useRequest(
    (action) => requestWrapper(
      taskAPI.approve.bind(null, { orgId, taskId, projectId, action }),
      {
        autoSuccess: true
      }
    ),
    {
      fetchKey: (action) => action,
      manual: true,
      onSuccess: () => {
        reload && reload();
        runLoop();
      }
    }
  ); 

  return (
    <div ref={ref} className={styles.deploy_log_card_wrapper}>
      <Card
        className='deploy-log-card'
        bodyStyle={{ background: 'rgba(36, 38, 35)', padding: 0 }}
        title={
          <div className='card-title'>
            <div className='card-title-top'>
              <span className='title'>部署日志</span> 
              <Tag className='status' color={TASK_STATUS_COLOR[status]}>{TASK_STATUS[status]}</Tag>
            </div>
            <div className='card-title-bottom'>执行总耗时：{timeUtils.diff(endAt, startAt, '-')}</div>
          </div>
        }
        extra={
          <Space size={24}>
            {
              PROJECT_OPERATOR && (
                <Space size={8}>
                  {
                    taskInfo.status === 'approving' && (
                      <>
                        <Button 
                          disabled={!PROJECT_APPROVER || approvedLoading}
                          onClick={() => passOrRejecy('rejected')}
                          loading={rejectedLoading} 
                        >
                          驳回
                        </Button>
                        <Button 
                          disabled={!PROJECT_APPROVER || rejectedLoading}
                          onClick={() => passOrRejecy('approved')} 
                          loading={approvedLoading} 
                          type='primary'
                        >
                          通过
                        </Button>
                      </>
                    )
                  }
                  {
                    type === 'plan' && status === 'complete' ? (
                      <Button 
                        type='primary'
                        onClick={applyTask}
                        loading={applyTaskLoading}
                      >
                        执行部署
                      </Button>
                    ) : null
                  }
                </Space>
              )
            }
            <Input
              prefix={<SearchOutlined style={{ color: '#AAACAB' }} />}
              ref={searchRef}
              placeholder='搜索日志'
              onPressEnter={(e) => {
                searchService.search(e.target.value);
                searchRef.current.focus();
              }}
              style={{ width: 240 }}
            />
            <span 
              className='tool'
              onClick={toggleFull} 
            >
              {
                isFullscreen ? (
                  <>
                    <FullscreenExitOutlined className='tool-icon'/>
                    <span className='tool-text'>退出全屏</span> 
                  </>
                ) : (
                  <>
                    <FullscreenOutlined className='tool-icon'/>
                    <span className='tool-text'>全屏显示</span>
                  </>
                )
              }
            </span>
          </Space>
        }
      >
        <Collapse 
          activeKey={activeKey} 
          onChange={setActiveKey}
          ghost={true} 
          accordion={true}
          className={classnames('deploy-log-collapse', { 'isFullscreen': isFullscreen })}
        >
          {
            taskSteps.map(({ name, id, startAt, type, endAt, status }) => (
              <Panel 
                header={
                  <Space>
                    <span>{name || type || '-'}</span>
                    {status === 'complete' && <CheckCircleFilled style={{ color: '#45BC13' }}/>}
                    {status === 'failed' && <CloseCircleFilled style={{ color: '#F23C3C' }}/>}
                    {status === 'running' && <SyncOutlined spin={true} style={{ color: '#ffffff' }}/>}
                  </Space>
                } 
                key={id}
                extra={timeUtils.diff(endAt, startAt)}
              >
                <DeployLog taskInfo={taskInfo} stepId={id} stepStatus={status}/>
              </Panel>
            ))
          }
        </Collapse>
      </Card>
    </div>
  );
};


export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS()
  };
})(DeployLogCard);