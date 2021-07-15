import React, { useState, useEffect, memo } from 'react';
import { Card, Space, Table, Input, notification, Descriptions, Menu } from 'antd';
import history from 'utils/history';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Eb_WP } from 'components/error-boundary';

import { envAPI, orgsAPI } from 'services/base';

const Index = (props) => {
  const { match, panel, routes } = props,
    { params: { orgId, projectId, envId } } = match;
  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [{ name: 1, id: 0 }],
      total: 0
    }),
    [ query, setQuery ] = useState({
      pageNo: 1,
      pageSize: 10,
      status: panel
    }),
    [ search, setSearch ] = useState('');

  useEffect(() => {
    fetchList();
  }, []);

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
      title: '作业类型'
    },
    {
      dataIndex: 'status',
      title: '状态'
    },
    {
      dataIndex: 'phone',
      title: '资源变更'
    },
    {
      dataIndex: 'createdAt',
      title: '开始执行时间'
    },
    {
      dataIndex: 'data',
      title: '执行时长'
    },
    {
      dataIndex: 'data',
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
            history.push(`/org/${orgId}/project/${projectId}/m-project-env/detail/${envId}/task/${r.id}`); 
          }}
        >进入详情</a>); 
      }
    }
  ];
  return <div>
    <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} bodyStyle={{ padding: 5 }} type={'inner'} title={'资源列表'}>
      <Table
        columns={columns}
        dataSource={resultMap.list}
        loading={loading}
        pagination={false}
      />
    </Card>
  </div>;
};

export default Eb_WP()(memo(Index));
