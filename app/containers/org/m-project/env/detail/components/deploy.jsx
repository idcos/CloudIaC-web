import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  notification,
  List,
  Button,
  Input
} from "antd";
import { ctAPI } from "services/base";
import { timeUtils } from "utils/time";
import { useEventSource } from "utils/hooks";
import AnsiCoderCard from "components/coder/ansi-coder-card/index";

export default (props) => {
  const { match, routesParams } = props;
  const taskId = match.params.taskId;
  const { curOrg, linkToRunningDetail, detailInfo, ctRunnerList } = routesParams;
  const { params: { orgId, projectId, envId } } = match;

  const [ taskInfo, setTaskInfo ] = useState({}),
    [ comments, setComments ] = useState([]),
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
    fetchSse();
    fetchComments();
  }, []);

  useEffect(() => {
    return () => {
      evtSource && evtSource.close();
    };
  }, [evtSource]);

  const fetchSse = (result) => {
    evtSourceInit(
      {
        onmessage: (data) => {
          setTaskLog((prevLog) =>
            [ ...prevLog, data ]
          );
        }
      },
      {
        url: `/api/v1/task/log/sse?id=run-c3nvra6cie6gqeidk8qg`,
        options: { withCredentials: true, headers: { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId } }
      }
    );
  };

  const fetchComments = async () => {
    try {
      const res = await ctAPI.taskComment({
        orgId: curOrg.id,
        taskId: taskId
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setComments((res.result || []).list);
    } catch (e) {
      notification.error({
        message: "获取失败",
        description: e.message
      });
    }
  };

  const onFinish = async (values) => {
    try {
      const res = await ctAPI.createTaskComment({
        orgId: curOrg.id,
        taskId: taskId,
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
        <AnsiCoderCard value={taskLog} />

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
      </div>
    </div>
  );
};
