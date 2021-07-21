import React, { useState, useEffect, memo } from 'react';
import { Card, Table, Input, notification } from 'antd';
import Coder from "components/coder";
import { Eb_WP } from 'components/error-boundary';

import { envAPI } from 'services/base';

const Index = (props) => {
  const { match, lastTaskId, routes } = props,
    { params: { orgId, projectId, envId, tplId, taskId } } = match;
  let taskIds = taskId || lastTaskId;
  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [],
      total: 0
    }),
    [ jsonData, setJsonData ] = useState({}),
    [ selectKeys, setSelectKeys ] = useState([]),
    [ search, setSearch ] = useState('');

  const resetList = (list) => {
    if (list.length) {
      let typeList = [...new Set(list.map(d => d.provider))];
      let ll = [];
      typeList.forEach(d => {
        let obj = {};
        let children = list.filter(t => t.provider === d).map(it => {
          it.count = 1;
          return it;
        });
        obj.provider = d;
        obj.count = children.length;
        obj.children = children;
        ll.push(obj);
      });
      return ll;
    }
  };

  useEffect(() => {
    fetchList();
  }, [search]); 

  useEffect(() => {
    if (taskIds) {
      fetchOutput();
    }
  }, [taskIds]);
  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await envAPI.envsResourcesList({ orgId, projectId, envId, q: search });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setResultMap({
        list: resetList(res.result.list)
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
      const res = await envAPI.envsOutput({ orgId, projectId, taskId: taskIds });
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
      dataIndex: 'provider',
      title: 'Provider'
    },
    {
      dataIndex: 'type',
      title: '类型'
    },
    {
      dataIndex: 'count',
      title: '数量'
    },
    {
      dataIndex: 'name',
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
  const onExpand = (expanded, record) => {
    if (expanded) {
      setSelectKeys([record.provider]);
    } else {
      setSelectKeys([]);
    }
  };
  return <div>
    <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={'Output'}>
      <Coder options={{ mode: '' }} value={JSON.stringify(jsonData, null, 2)} style={{ height: 'auto' }} />
    </Card>
    <Card 
      style={{ marginTop: 24 }}
      headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} 
      bodyStyle={{ padding: 0 }} 
      type={'inner'} 
      title={'资源列表'}
    >
      <Input.Search
        placeholder='请输入关键字搜索'
        style={{ width: 240, margin: 20 }}
        onSearch={v => setSearch(v)}
      />
      <Table
        columns={columns}
        dataSource={resultMap.list}
        rowKey={record => record.provider}
        loading={loading}
        pagination={false}
        expandedRowKeys={selectKeys}
        onExpand={(a, b) => onExpand(a, b)}
      />
    </Card>
  </div>;
};

export default Eb_WP()(memo(Index));
