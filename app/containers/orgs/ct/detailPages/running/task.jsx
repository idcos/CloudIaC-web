import React, { useState, useEffect } from 'react';
import { Form, Collapse, notification, Tag, Descriptions, Badge, List, Button, Input, Card, Space } from 'antd';
import {
  FullscreenExitOutlined, FullscreenOutlined
} from '@ant-design/icons';
import { ctAPI } from 'services/base';
import { CT } from 'constants/types';
import { statusTextCls, formatCTRunner } from 'utils/util';
import { timeUtils } from 'utils/time';
import { useEventSource } from 'utils/hooks';
import Coder from 'components/coder';
import moment from 'moment';
import AnsiRegex from 'ansi-regex';

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
    render: (taskInfo) => {
      const { backendInfo, ctRunnerList } = taskInfo;
      const { ctServiceId } = backendInfo || {};
      return formatCTRunner(ctRunnerList, ctServiceId)
    }
  }, {
    label: '作业运行时间',
    key: 'runTime',
    span: 2,
    render: (taskInfo) => <span>
      {timeUtils.format(taskInfo.createdAt)} ~ {timeUtils.format(taskInfo.endAt)}
      耗时
    </span>
  }];

export default (props) => {
  const { match, routesParams } = props;
  const curTask = Number(match.params.curTask);
  const { curOrg, linkToRunningDetail, detailInfo, ctRunnerList } = routesParams;
  const [ taskInfo, setTaskInfo ] = useState({}),
    [ comments, setComments ] = useState([]),
    [ fullScreen, setFullScreen ] = useState(false),
    [ loading, setLoading ] = useState(false),
    [ taskLog, setTaskLog ] = useState('');

  const [form] = Form.useForm();
  const [ evtSource, evtSourceInit ] = useEventSource();

  useEffect(() => {
    if (curTask) {
      fetchInfo(fetchSse);
      fetchComments();
    }
  }, [curTask]);

  useEffect(() => {
    return () => {
      evtSource && evtSource.close();
    };
  }, [evtSource]);

  const fetchSse = (res) => {
    evtSourceInit(
      {
        onmessage: (data) => {
          data = data.replace(AnsiRegex(), '\u001B');
          return setTaskLog(prevLog => prevLog ? `${prevLog}\n${data}` : data);
        },
        onerror: () => {
          fetchInfo();
        }
      },
      {
        url: `/api/v1/taskLog/sse?logPath=${res.result.backendInfo.log_file}`,
        options: { withCredentials: true }
      }
    );
  };

  const fetchInfo = async (cb) => {
    try {
      setLoading(true);
      const res = await ctAPI.detailTask({
        orgId: curOrg.id,
        taskId: curTask
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      cb && cb(res);
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

  const applyTask = async (e) => {
    e.stopPropagation();
    try {
      const { name, ctServiceId, templateId, templateGuid } = taskInfo;
      const ctInfo = ctRunnerList.find(it => it.ID == ctServiceId) || {};
      const { Port, Address } = ctInfo;
      const createTaskRes = await ctAPI.createTask({
        taskType: 'apply',
        orgId: curOrg.id,
        name,
        ctServiceId,
        templateId,
        templateGuid,
        ctServiceIp: Address,
        ctServicePort: Port
      });
      if (createTaskRes.code != 200) {
        throw new Error(createTaskRes.message);
      }
      notification.success({
        message: '操作成功'
      });
      linkToRunningDetail(createTaskRes.result && createTaskRes.result.id);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  return <div className='task'>
    <div className={'tableRender'}>
      <Collapse className='collapse-panel'>
        <Panel
          header={
            <div className='header'>
              <span className='title-text'>
                {taskInfo.creatorName || '-'} {moment(taskInfo.createdAt).fromNow() || '-'} 从 {taskInfo.repoBranch} {taskInfo.repoCommit} 执行作业
              </span>
              <Tag color={statusTextCls(taskInfo.status).color}>{CT.taskStatus[taskInfo.status]}</Tag>
            </div>
          }
          extra={
            taskInfo.taskType === 'plan' ?
              <Button 
                onClick={applyTask} size='small'
                disabled={!taskInfo.allowApply || detailInfo.status === "disable"} 
              >apply</Button> 
              : null
          }
        >
          <Descriptions
            column={2}
          >
            {items.map(it => <Item label={it.label} span={it.span || 1}>
              {it.render ? it.render({...(taskInfo || {}), ctRunnerList}) : taskInfo[it.key]}
            </Item>)}
          </Descriptions>
        </Panel>
      </Collapse>

      <Collapse className='collapse-panel' defaultActiveKey={['1']}>
        <Panel
          className='panel-content-no-paading'
          style={{ padding: 0 }}
          header={<h2>作业内容</h2>}
          key={'1'}
        >
          <Card
            className={`card-body-no-paading ${fullScreen ? 'full-card' : ''}`}
            extra={
              <Space>
                <Button onClick={() => setFullScreen(!fullScreen)}>
                  {fullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                  全屏显示
                </Button>
              </Space>
            }
          >
            <Coder 
              options={{
                mode: 'ansi'
              }}
              selfClassName='card-coder'
              value={taskLog} onChange={() => ''}
            />
          </Card>
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
                  title={
                    <h2 className='title'>
                      {item.creator}<span className='subTitle'>{timeUtils.format(item.createdAt)}</span>
                    </h2>}
                  description={<p className='content'>{item.comment}</p>}
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
              {({ getFieldValue }) => <Button type='primary' htmlType='submit' disabled={!getFieldValue('comment') || detailInfo.status === "disable"}>发表评论</Button>}
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>
    </div>
  </div>;
};
