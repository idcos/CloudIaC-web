import React, { useState, useEffect, memo } from 'react';
import { Card, Space, Table, Input, notification, Descriptions, Menu } from 'antd';
import history from 'utils/history';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Eb_WP } from 'components/error-boundary';

import { pjtAPI, orgsAPI } from 'services/base';

const Index = (props) => {
  const { match, panel, routes } = props,
    { params: { orgId } } = match;
  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [1],
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
      const { combinedStatus } = query;
      const res = await pjtAPI.projectList({
        statu: panel,
        orgId: orgId
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
      dataIndex: 'name',
      title: '云平台'
    },
    {
      dataIndex: 'email',
      title: '类型'
    },
    {
      dataIndex: 'phone',
      title: '数量'
    },
    {
      dataIndex: 'data',
      title: '名称'
    },
    {
      dataIndex: 'typeUser',
      title: '模块',
      editable: true,
      width: 200,
      render: (t, r) => {
        return (<div>{t}</div>); 
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
