import React, { useState, useEffect, memo } from 'react';
import { Card, Table, notification } from 'antd';

import history from 'utils/history';
import ChangeInfo from 'components/change-info';
import { timeUtils } from "utils/time";
import { TASK_STATUS, TASK_TYPE } from 'constants/types';
import { Eb_WP } from 'components/error-boundary';
import { envAPI } from 'services/base';
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
      const res = await envAPI.envsTaskList({
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
      render: (t, r) => <span>{TASK_TYPE[t] || '-'}</span>
    },
    {
      dataIndex: 'status',
      title: '状态',
      render: (t, r) => <span>{TASK_STATUS[t] || '-'}</span>
    },
    {
      dataIndex: 'result',
      title: '资源变更',
      render: (t, r) => {
        return <ChangeInfo {...r.result} />;
      }
    },
    {
      dataIndex: 'createdAt',
      title: '开始执行时间',
      render: (t) => timeUtils.format(t)
    },
    {
      dataIndex: 'startAt',
      title: '执行时长',
      render: (t, r) => timeUtils.diff(r.endAt, t)
    },
    {
      dataIndex: 'creator',
      title: '执行人'
    },
    {
      dataIndex: 'action',
      title: '操作',
      editable: true,
      width: 80,
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
        dataSource={resultMap.list}
        loading={loading}
        pagination={false}
      />
    </Card>
  </div>
  ;
};

export default Eb_WP()(memo(Index));
