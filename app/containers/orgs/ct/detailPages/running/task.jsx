import React, { useState, useEffect } from 'react';
import { Form, Collapse, notification, Tag, Descriptions, Badge, List, Button, Input } from 'antd';

import { ctAPI } from 'services/base';
import { CT } from 'constants/types';
import { statusTextCls } from 'utils/util';
import { timeUtils } from 'utils/time';
import { useEventSource } from 'utils/hooks';
import Coder from 'components/coder';
import moment from 'moment';

const { Panel } = Collapse;
const { Item } = Descriptions;

const items = [
  {
    label: '作业ID',
    key: 'guid'
  }, {
    label: '作业状态',
    key: 'status',
    render: (taskInfo) => {
      return <>
        <Badge color={statusTextCls(taskInfo.status).color}/>
        <span>{CT.taskStatus[taskInfo.status]}</span>
      </>;
    }
  }, {
    label: '作业类型',
    key: 'taskTupe',
    render: (taskInfo) => CT.taskType[taskInfo.taskType]
  }, {
    label: '创建人',
    key: 'creatorName'
  }, {
    label: '创建时间',
    key: 'createdAt',
    render: (taskInfo) => timeUtils.format(taskInfo.createdAt)
  }, {
    label: '作业描述',
    key: 'description'
  }, {
    label: '仓库地址',
    key: 'repoAddr'
  }, {
    label: '分支',
    key: 'repoBranch'
  }, {
    label: 'commitId',
    key: 'commitId',
    span: 2
  }, {
    label: 'ct-runner',
    key: 'ctServiceId',
    span: 2,
    render: (taskInfo) => (taskInfo.backendInfo || {}).ctServiceId
  }, {
    label: '作业运行时间',
    key: 'runTime',
    span: 2,
    render: (taskInfo) => <span>
      {timeUtils.format(taskInfo.createdAt)} ~ {timeUtils.format(taskInfo.endAt)}
      耗时
    </span>
  }];

export default ({ curOrg, curTask }) => {
  const [ taskInfo, setTaskInfo ] = useState({}),
    [ comments, setComments ] = useState([]),
    [ loading, setLoading ] = useState(false),
    [ taskLog, setTaskLog ] = useState('');

  const [form] = Form.useForm();
  const [ evtSource, evtSourceInit ] = useEventSource();

  useEffect(() => {
    fetchInfo();
    fetchComments();
  }, []);

  useEffect(() => {
    return () => {
      evtSource && evtSource.close();
    };
  }, [evtSource]);

  const fetchInfo = async () => {
    try {
      setLoading(true);
      const res = await ctAPI.detailTask({
        orgId: curOrg.id,
        taskId: curTask
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      evtSourceInit(
        {
          onmessage: (data) => setTaskLog(prevLog => prevLog ? `${prevLog}\n${data}` : data)
        },
        {
          url: `/api/v1/taskLog/sse?logPath=${res.result.backendInfo.log_file}`,
          options: { withCredentials: true }
        }
      );
      setTaskInfo(res.result || {});
      setLoading(false);
    } catch (e) {
      setLoading(false);
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const fetchComments = async () => {
    try {
      const res = await ctAPI.taskComment({
        orgId: curOrg.id,
        taskId: curTask
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setComments((res.result || []).list);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const onFinish = async (values) => {
    try {
      const res = await ctAPI.createTaskComment({
        orgId: curOrg.id,
        taskId: curTask,
        ...values
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: '操作成功'
      });
      form.resetFields();
      fetchComments();
    } catch (e) {
      notification.error({
        message: e.message
      });
    }
  };

  return <div className='task'>
    <div className={'tableRender'}>
      <Collapse className='collapse-panel'>
        <Panel header={
          <h2>
            {taskInfo.creatorName || '-'} {moment(taskInfo.createdAt).fromNow() || '-'} 从 {taskInfo.repoBranch} {taskInfo.repoCommit} 执行作业
            &nbsp;<Tag color={statusTextCls(taskInfo.status).color}>{CT.taskStatus[taskInfo.status]}</Tag>
          </h2>
        }
        >
          <Descriptions
            column={2}
          >
            {items.map(it => <Item label={it.label} span={it.span || 1}>
              {it.render ? it.render(taskInfo || {}) : taskInfo[it.key]}
            </Item>)}
          </Descriptions>
        </Panel>
      </Collapse>

      <Collapse className='collapse-panel' defaultActiveKey={['1']}>
        <Panel
          header={<h2>作业内容</h2>}
          key={'1'}
        >
          <Coder value={taskLog} onChange={() => ''}/>
        </Panel>
      </Collapse>

      <Collapse
        className='collapse-panel'
      >
        <Panel header={
          <h2>评论</h2>
        }
        >
          <List
            loading={loading}
            itemLayout='horizontal'
            dataSource={comments}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={<h2 className='title'>{item.creatorName}<span className='subTitle'>{timeUtils.format(item.createdAt)}</span></h2>}
                  description={<p>{item.comment}</p>}
                />
              </List.Item>
            )}
          />
          <Form
            layout='vertical'
            onFinish={onFinish}
            form={form}
          >
            <Form.Item
              label='描述'
              name='comment'
              rules={[
                {
                  message: '请输入'
                }
              ]}
            >
              <Input.TextArea placeholder='请输入评论内容'/>
            </Form.Item>
            <Form.Item
              shouldUpdate={true}
            >
              {({ getFieldValue }) => <Button type='primary' htmlType='submit' disabled={!getFieldValue('comment')}>发表评论</Button>}
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>
    </div>
  </div>;
};
