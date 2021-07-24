import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  notification,
  List,
  Button,
  Input,
  Card,
  Row,
  Tag,
  Spin,
  Tooltip
} from "antd";
import { InfoCircleFilled } from '@ant-design/icons';
import { connect } from "react-redux";

import getPermission from "utils/permission";
import { TASK_STATUS, TASK_STATUS_COLOR, TASK_TYPE } from 'constants/types';
import { ctAPI, envAPI } from "services/base";
import history from 'utils/history';
import { timeUtils } from "utils/time";
import { useEventSource } from "utils/hooks";
import AnsiCoderCard from "components/coder/ansi-coder-card/index";

import styles from '../styles.less';

const deployJournal = (props) => {
  const { match, reload, taskInfo, taskId, userInfo } = props;
  const { params: { orgId, projectId, envId } } = match;
  const { PROJECT_OPERATOR, PROJECT_APPROVER } = getPermission(userInfo);

  const [ comments, setComments ] = useState([]),
    [ loading, setLoading ] = useState(false),
    [ btnsSpinning, setBtnsSpinning ] = useState(false),
    [ taskLog, setTaskLog ] = useState([]);

  const endRef = useRef();
  const [form] = Form.useForm();
  const [ evtSource, evtSourceInit ] = useEventSource();

  useEffect(() => {
    return () => {
      endRef.current = true;
    };
  }, []);

  useEffect(() => {
    if (taskId) {
      fetchSse();
      fetchComments();
    }
  }, [taskId]);
  
  useEffect(() => {
    return () => {
      evtSource && evtSource.close();
    };
  }, [evtSource]);

  const fetchSse = () => {
    evtSourceInit(
      {
        onmessage: (data) => {
          setTaskLog((prevLog) => [ ...prevLog, data ]);
        }
      },
      {
        url: `/api/v1/task/log/sse?id=${taskId}`,
        options: { withCredentials: true, headers: { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId } }
      }
    );
  };

  const passOrRejecy = async(action) => {
    try {
      setBtnsSpinning(true);
      const res = await envAPI.approve({
        orgId, taskId, projectId, action
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: "操作成功"
      });
      reload && reload();
    } catch (e) {
      setBtnsSpinning(false);
      notification.error({
        message: "操作失败",
        description: e.message
      });
    }
  };

  const applyTask = async () => {
    try {
      setLoading(true);
      const res = await envAPI.envRedeploy({
        orgId, projectId, envId, taskType: 'apply'
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setLoading(false);
      const { taskId: taskID } = res.result || {};
      history.push(`/org/${orgId}/project/${projectId}/m-project-env/detail/${envId}/deployHistory/task/${taskID}`); 
    } catch (e) {
      setLoading(false);
      notification.error({
        message: "操作失败",
        description: e.message
      });
    }
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await ctAPI.taskComment({
        orgId, taskId, projectId
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setLoading(false);
      setComments((res.result || []).list);
    } catch (e) {
      setLoading(false);
      notification.error({
        message: "获取失败",
        description: e.message
      });
    }
  };

  const onFinish = async (values) => {
    try {
      const res = await ctAPI.createTaskComment({     
        orgId, taskId, projectId,
        ...values
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: "操作成功"
      });
      form.resetFields();
      fetchComments();
    } catch (e) {
      notification.error({
        message: e.message
      });
    }
  };
  return (
    <div className={styles.deployJournal}>
      <div className={"tableRender"}>
        <Card 
          headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} 
          type={'inner'} 
          title={'作业内容'}
          extra={
            PROJECT_OPERATOR && taskInfo.type === 'plan' && taskInfo.status === 'complete' ? (
              <Button onClick={applyTask}>apply</Button>
            ) : null
          }
        >
          <AnsiCoderCard 
            value={taskLog} 
            cardTitleAfter={(
              <>
                {
                  TASK_STATUS[taskInfo.status] ? (
                    <Tag color={TASK_STATUS_COLOR[taskInfo.status] || 'default'}>{TASK_STATUS[taskInfo.status]}</Tag>
                  ) : '-'
                }
                {
                  taskInfo.status === 'failed' && taskInfo.message ? (
                    <Tooltip title={taskInfo.message}>
                      <InfoCircleFilled style={{ color: '#ff4d4f' }} />
                    </Tooltip>
                  ) : null
                }
              </>
            )} 
          />
          {
            (taskInfo.status === 'approving' && PROJECT_OPERATOR) ? (
              <Spin spinning={btnsSpinning}>
                <Row style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    disabled={!PROJECT_APPROVER}
                    onClick={() => passOrRejecy('rejected')} 
                    style={{ marginTop: 20 }} 
                  >
                    驳回
                  </Button>
                  <Button 
                    disabled={!PROJECT_APPROVER}
                    onClick={() => passOrRejecy('approved')} 
                    style={{ marginTop: 20, marginLeft: 20 }} 
                    type='primary'
                  >
                    通过
                  </Button>
                </Row>
              </Spin>
            ) : null
          }
        </Card>
        <Card 
          style={{ marginTop: 24 }}
          headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} 
          type={'inner'} 
          title={'评论'}
        >
          <List
            loading={loading}
            itemLayout='horizontal'
            dataSource={comments}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <h2 className='title reset-styles'>
                      {item.creator}
                      <span className='subTitle'>
                        {timeUtils.format(item.createdAt)}
                      </span>
                    </h2>
                  }
                  description={<p className='content reset-styles'>{item.comment}</p>}
                />
              </List.Item>
            )}
          />
          {
            PROJECT_OPERATOR ? (
              <Form layout='vertical' onFinish={onFinish} form={form}>
                <Form.Item
                  label='描述'
                  name='comment'
                  rules={[
                    {
                      message: "请输入"
                    }
                  ]}
                >
                  <Input.TextArea placeholder='请输入评论内容' />
                </Form.Item>
                <Form.Item shouldUpdate={true}>
                  {({ getFieldValue }) => (
                    <Button
                      type='primary'
                      htmlType='submit'
                      disabled={
                        !getFieldValue("comment") 
                      }
                    >
                      发表评论
                    </Button>
                  )}
                </Form.Item>
              </Form>
            ) : null
          }
        </Card>
      </div>
    </div>
  );
};

export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS()
  };
})(deployJournal);