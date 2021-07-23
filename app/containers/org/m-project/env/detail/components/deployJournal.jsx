import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  notification,
  List,
  Button,
  Input,
  Card,
  Row
} from "antd";
import { connect } from "react-redux";

import getPermission from "utils/permission";
import { ctAPI, envAPI } from "services/base";
import { timeUtils } from "utils/time";
import { useEventSource } from "utils/hooks";
import AnsiCoderCard from "components/coder/ansi-coder-card/index";

const deployJournal = (props) => {
  const { match, reload, info, userInfo } = props;
  const { params: { orgId, projectId, envId, taskId } } = match;
  const taskID = taskId || info.lastTaskId;
  const { PROJECT_OPERATOR, PROJECT_APPROVER } = getPermission(userInfo);

  const [ comments, setComments ] = useState([]),
    [ loading, setLoading ] = useState(false),
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
    if (taskID) {
      fetchSse();
      fetchComments();
    }
  }, [taskID]);
  
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
        url: `/api/v1/task/log/sse?id=${taskID}`,
        options: { withCredentials: true, headers: { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId } }
      }
    );
  };

  const passOrRejecy = async(action) => {
    try {
      const res = await envAPI.approve({
        orgId, taskId: taskID, projectId, action
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: "操作成功"
      });
      reload && reload();
    } catch (e) {
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
        orgId, taskId: taskID, projectId
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
        orgId, taskId: taskID, projectId,
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
    <div className='task'>
      <div className={"tableRender"}>
        <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={'作业内容'}>
          <AnsiCoderCard value={taskLog} />
          {
            (info.status === 'approving' && PROJECT_OPERATOR) ? (
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