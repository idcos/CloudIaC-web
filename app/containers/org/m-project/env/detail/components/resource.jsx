import React, { useState, useEffect, memo } from 'react';
import { Card, Table, Input, notification } from 'antd';

import Coder from "components/coder";
import { Eb_WP } from 'components/error-boundary';

import envAPI from 'services/env';
import taskAPI from 'services/task';

import ResourceModal from './modal/resource-modal';

const Index = (props) => {
  const { match, taskId, type } = props,
    { params: { orgId, projectId, envId } } = match;
  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [],
      total: 0
    }),
    [ jsonData, setJsonData ] = useState({}),
    [ selectKeys, setSelectKeys ] = useState([]),
    [ visible, setVisible ] = useState(false),
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
      return ll || [];
    } else {
      return [];
    }
  };

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
      const resourcesApis = {
        env: envAPI.getResourcesList.bind(null, { orgId, projectId, envId, q: search }),
        task: taskAPI.getResourcesList.bind(null, { orgId, projectId, taskId, q: search })
      };
      const res = await resourcesApis[type]();
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setResultMap({
        list: resetList(res.result.list)
      });
      !!resetList(res.result.list)[0] && setSelectKeys([resetList(res.result.list)[0].provider]);
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
      const outputApis = {
        env: envAPI.getOutput.bind(null, { orgId, projectId, envId }),
        task: taskAPI.getOutput.bind(null, { orgId, projectId, taskId })
      };
      const res = await outputApis[type]();
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
      title: '名称',
      render: (t, r) => <a onClick={() => setVisible(true)}>{t}</a>
    },
    {
      dataIndex: 'module',
      title: '模块'
    }
  ];
  const onExpand = (expanded, record) => {
    if (expanded) {
      setSelectKeys([ ...selectKeys, record.provider ]);
    } else {
      setSelectKeys((selectKeys.filter(d => d !== record.provider) || []));
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
      <ResourceModal visible={visible} />
    </Card>
  </div>;
};

export default Eb_WP()(memo(Index));
