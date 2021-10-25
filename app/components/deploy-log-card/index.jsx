import React, { useState, useEffect } from "react";
import { Card, Space, Button, Tag, Collapse } from "antd";
import { CloseCircleFilled, CheckCircleFilled, SyncOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import getPermission from "utils/permission";
import { TASK_STATUS, TASK_STATUS_COLOR, END_TASK_STATUS_LIST } from 'constants/types';
import envAPI from 'services/env';
import taskAPI from 'services/task';
import history from 'utils/history';
import { timeUtils } from "utils/time";
import DeployLog from './deploy-log';
import styles from './styles.less';

const { Panel } = Collapse;

const DeployLogCard = ({ taskInfo, userInfo, reload }) => {

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
      formatResult: res => res.list || [],
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
    <Card
      bodyStyle={{ background: 'rgba(36, 38, 35)', padding: 0 }}
      title={
        <div className={styles.card_title}>
          <div className={styles.card_title_top}>
            <span className={styles.title}>部署日志</span> 
            <Tag className={styles.status} color={TASK_STATUS_COLOR[status]}>{TASK_STATUS[status]}</Tag>
          </div>
          <div className={styles.card_title_bottom}>执行总耗时：{timeUtils.diff(endAt, startAt, '-')}</div>
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
        </Space>
      }
    >
      <Collapse 
        activeKey={activeKey} 
        onChange={setActiveKey}
        ghost={true} 
        accordion={true}
        className={styles.deploy_log_collapse}
      >
        {
          taskSteps.map(({ name, id, startAt, endAt, status }) => (
            <Panel 
              header={
                <Space>
                  <span>{name || '-'}</span>
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
  );
};


export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS()
  };
})(DeployLogCard);