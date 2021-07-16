import React, { useState, useEffect, memo } from 'react';
import { Card, Space, Table, Input, notification, Descriptions, Menu } from 'antd';
import CoderCard from 'components/coder/coder-card';
import Coder from "components/coder";
import { Eb_WP } from 'components/error-boundary';

import { envAPI } from 'services/base';

const Index = (props) => {
  const { match, taskId, routes } = props,
    { params: { orgId, projectId, envId, ctId } } = match;
  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [],
      total: 0
    }),
    [ jsonData, setJsonData ] = useState({
      "additionalProp1": {
        "additionalProp1": {}
      }
    }),
    [ search, setSearch ] = useState('');

  useEffect(() => {
    fetchList();
  }, [search]); 

  useEffect(() => {
    if (taskId) {
      fetchOutput();
    }
  }, [taskId]);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await envAPI.envsResourcesList({ orgId, projectId, envId, q: search });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setResultMap({
        list: res.result.list || []
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

  const fetchOutput = async () => {
    try {
      setLoading(true);
      const res = await envAPI.envsOutput({ orgId, projectId, taskId });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setJsonData(res.result || {});
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
    <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={'Output'}>
      <Coder options={{ mode: '' }} value={JSON.stringify(jsonData, null, 2)} style={{ height: 'auto' }} />
    </Card>
    <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} bodyStyle={{ padding: 0 }} type={'inner'} title={'资源列表'}>
      <Input.Search
        placeholder='请输入关键字搜索'
        style={{ width: 240, margin: 20 }}
        onSearch={v => setSearch(v)}
      />
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
