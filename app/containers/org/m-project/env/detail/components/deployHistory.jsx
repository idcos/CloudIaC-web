import React, { useState, useEffect, memo } from 'react';
import { Card, Table, notification, Tag, Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';

import history from 'utils/history';
import ChangeInfo from 'components/change-info';
import { timeUtils } from "utils/time";
import { TASK_STATUS, TASK_STATUS_COLOR, TASK_TYPE } from 'constants/types';
import { Eb_WP } from 'components/error-boundary';
import taskAPI from 'services/task';
import isEmpty from 'lodash/isEmpty';

const Index = (props) => {
  const { match, info } = props,
    { params: { orgId, projectId, envId } } = match;
  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [{ name: 1, id: 0 }],
      total: 0
    });

  useEffect(() => {
    if (!isEmpty(info)) {
      fetchList();
    }
  }, [info]);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await taskAPI.envsTaskList({
        orgId, projectId, envId
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setResultMap({
        list: res.result.list || [],
        total: res.result.total || 0
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };
  const columns = [
    {
      dataIndex: 'type',
      title: '作业类型',
      width: 168,
      ellipsis: true,
      render: (t, r) => <span>{TASK_TYPE[t] || '-'}</span>
    },
    {
      dataIndex: 'status',
      title: '状态',
      width: 134,
      ellipsis: true,
      render: (t, r) => (
        <>
          {
            TASK_STATUS[t] ? (
              <Tag color={TASK_STATUS_COLOR[t] || 'default'}>{TASK_STATUS[t]}</Tag>
            ) : '-'
          }
          {
            t === 'failed' && r.message ? (
              <Tooltip title={r.message}>
                <InfoCircleFilled style={{ color: '#ff4d4f' }} />
              </Tooltip>
            ) : null
          }
        </>
      )
    },
    {
      dataIndex: 'result',
      title: '资源变更',
      width: 153,
      ellipsis: true,
      render: (t, r) => {
        return <ChangeInfo {...r.result} />;
      }
    },
    {
      dataIndex: 'createdAt',
      title: '开始执行时间',
      width: 180,
      ellipsis: true,
      render: (t) => timeUtils.format(t)
    },
    {
      dataIndex: 'startAt',
      title: '执行时长',
      width: 180,
      ellipsis: true,
      render: (t, r) => timeUtils.diff(r.endAt, t)
    },
    {
      dataIndex: 'creator',
      title: '执行人',
      width: 130,
      ellipsis: true
    },
    {
      dataIndex: 'action',
      title: '操作',
      width: 169,
      ellipsis: true,
      fixed: 'right',
      render: (t, r) => {
        return (<a
          onClick={() => {
            history.push(`/org/${orgId}/project/${projectId}/m-project-env/detail/${envId}/deployHistory/task/${r.id}`); 
          }}
        >进入详情</a>); 
      }
    }
  ];
  return <div>
    <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} bodyStyle={{ padding: 5 }} type={'inner'} title={'部署历史'}>
      <Table
        columns={columns}
        scroll={{ x: 'min-content', y: 570 }}
        dataSource={resultMap.list}
        loading={loading}
        pagination={false}
      />
    </Card>
  </div>
  ;
};

export default Eb_WP()(memo(Index));
