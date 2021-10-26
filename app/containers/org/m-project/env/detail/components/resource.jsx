import React, { useState, useEffect, memo } from 'react';
import { Table, Input, notification, Collapse } from 'antd';
import { useEventEmitter } from 'ahooks';
import Coder from "components/coder";
import { Eb_WP } from 'components/error-boundary';
import ResourceViewModal from 'components/resource-view-modal';
import envAPI from 'services/env';
import taskAPI from 'services/task';

const { Panel } = Collapse;

const Index = (props) => {

  const event$ = useEventEmitter();
  const { match, taskId, type } = props;
  const { orgId, projectId, envId } = match.params || {};
  const [ loading, setLoading ] = useState(false);
  const [ jsonData, setJsonData ] = useState({});
  const [ selectKeys, setSelectKeys ] = useState([]);
  const [ search, setSearch ] = useState('');
  const [ resultMap, setResultMap ] = useState({
    list: [],
    total: 0
  });
 
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
      title: 'Provider',
      ellipsis: true,
      width: 258
    },
    {
      dataIndex: 'type',
      title: '类型',
      ellipsis: true,
      width: 240
    },
    {
      dataIndex: 'count',
      title: '数量',
      ellipsis: true,
      width: 120
    },
    {
      dataIndex: 'name',
      title: '名称',
      ellipsis: true,
      width: 200,
      render: (text, record) => {
        const { id } = record;
        const params = { resourceName: text, orgId, projectId, envId, resourceId: id };
        return (
          <a onClick={() => event$.emit({ type: 'open-resource-view-modal', data: { params } })}>
            {text}
          </a>
        );
      }
     
    },
    {
      dataIndex: 'module',
      title: '模块',
      ellipsis: true,
      width: 240
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
    <Collapse expandIconPosition={'right'} defaultActiveKey={['1']} forceRender={true}>
      <Panel header='Output' key='1'>
        <Coder value={JSON.stringify(jsonData, null, 2)} style={{ height: 'auto' }} />
      </Panel>
    </Collapse>
    <div className={'collapseInTable'}>
      <Collapse expandIconPosition={'right'} style={{ marginTop: 24 }} defaultActiveKey={['1']} forceRender={true}>
        <Panel header='资源列表' key='1'>
          <Input.Search
            placeholder='请输入关键字搜索'
            style={{ width: 240, margin: 20 }}
            onSearch={v => setSearch(v)}
          />
          <Table
            columns={columns}
            dataSource={resultMap.list}
            rowKey={record => record.provider}
            scroll={{ x: 'min-content', y: 570 }}
            loading={loading}
            pagination={false}
            expandedRowKeys={selectKeys}
            onExpand={(a, b) => onExpand(a, b)}
          /> 
        </Panel>
      </Collapse>
    </div>
    <ResourceViewModal event$={event$}/>
  </div>;
};

export default Eb_WP()(memo(Index));
