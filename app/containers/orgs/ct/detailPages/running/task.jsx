import React, { useState, useEffect } from 'react';
import { Form, Collapse, notification, Tag, Descriptions, Badge, List, Button, Divider, Input } from 'antd';

import { ctAPI } from 'services/base';
import { CT } from 'constants/types';
import { timeUtils } from 'utils/time';

const { Panel } = Collapse;
const { Item } = Descriptions;

const statusColor = (status) => {
  let color = 'blue';
  switch (status) {
    case 'failed':
      color = 'red';
      break;
    case 'pending':
      color = 'green';
      break;
    default:
      return;
  }
  return color;
};
const items = [
  {
    label: '作业ID',
    key: 'guid'
  }, {
    label: '作业状态',
    key: 'status',
    render: (taskInfo) => {
      return <>
        <Badge color={statusColor(taskInfo.status)}/>
        <span>{CT.taskStatus[taskInfo.status]}</span>
      </>;
    }
  }, {
    label: '作业类型',
    key: 'taskTupe',
    render: (taskInfo) => CT.taskType[taskInfo.taskType]
  }, {
    label: '创建人',
    key: 'creator'
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
    label: 'commit',
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
    [ loading, setLoading ] = useState(false);

  useEffect(() => {
    fetchInfo();
  }, []);

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

  const onFinish = async (values) => {
    try {
      const res = await ctAPI.taskComment({
        ...values
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: '操作成功'
      });
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
            {taskInfo.creator || '-'} {timeUtils.format(taskInfo.createdAt) || '-'} 从 {taskInfo.repoBranch} {taskInfo.commitId}
            <Tag color={statusColor(taskInfo.status)}>{CT.taskStatus[taskInfo.status]}</Tag>
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

        </Panel>
      </Collapse>

      <Collapse>
        <Panel header={
          <h2>评论</h2>
        }
        >
          <List
            loading={loading}
            itemLayout='horizontal'
            dataSource={[]}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={<h2>---</h2>}
                  description={'--'}
                />
              </List.Item>
            )}
          />
          <Form
            layout='vertical'
            onFinish={onFinish}
          >
            <Form.Item
              label='描述'
              name='name'
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
              {({ getFieldValue }) => <Button type='primary' disabled={!getFieldValue('name')}>发表评论</Button>}
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>
    </div>
  </div>;
};
