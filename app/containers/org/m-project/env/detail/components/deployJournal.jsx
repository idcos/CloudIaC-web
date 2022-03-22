import React, { useState, useEffect, useRef, useContext } from "react";
import { Form, notification, List, Button, Input, Collapse } from "antd";
import { connect } from "react-redux";
import getPermission from "utils/permission";
import taskAPI from 'services/task';
import { timeUtils } from "utils/time";
import DeployLogCard from 'components/deploy-log-card';
import styles from '../styles.less';
import DetailPageContext from '../detail-page-context';

const { Panel } = Collapse;

const deployJournal = () => {

  const { userInfo, taskInfo, taskId, reload, orgId, projectId, envInfo } = useContext(DetailPageContext);
  const { PROJECT_OPERATOR } = getPermission(userInfo);
  const [ comments, setComments ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const endRef = useRef();
  const [form] = Form.useForm();

  useEffect(() => {
    return () => {
      endRef.current = true;
    };
  }, []);

  useEffect(() => {
    if (taskId) {
      fetchComments();
    }
  }, [taskId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await taskAPI.taskComment({
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
      const res = await taskAPI.createTaskComment({     
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
      <DeployLogCard taskInfo={taskInfo} envInfo={envInfo} reload={reload}/>
      <Collapse expandIconPosition={'right'} style={{ marginTop: 24 }} defaultActiveKey={[]} forceRender={true}>
        <Panel header={<span>评论（{comments.length}）</span>} key='1'>
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
        </Panel>
      </Collapse>
    </div>
  );
};

export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS()
  };
})(deployJournal);