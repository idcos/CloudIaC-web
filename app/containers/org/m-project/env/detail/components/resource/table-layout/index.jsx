import React, { useState, useEffect, useContext } from 'react';
import { Table, Input, Space, Button, Row } from 'antd';
import { useRequest, useEventEmitter } from 'ahooks';
import { FundViewOutlined } from "@ant-design/icons";
import { requestWrapper } from 'utils/request';
import ResourceViewModal from 'components/resource-view-modal';
import envAPI from 'services/env';
import taskAPI from 'services/task';
import DetailPageContext from '../../../detail-page-context';

const TableLayout = ({ setMode }) => {

  const event$ = useEventEmitter();
  const { taskId, type, orgId, projectId, envId } = useContext(DetailPageContext);
  const [ expandedRowKeys, setExpandedRowKeys ] = useState([]);
  const [ search, setSearch ] = useState('');
 
  useEffect(() => {
    fetchResourceData();
  }, [search]);
  
  const { data: resourceData = [], run: fetchResourceData, loading } = useRequest(
    () => {
      const resourcesApis = {
        env: envAPI.getResourcesList.bind(null, { orgId, projectId, envId, q: search }),
        task: taskAPI.getResourcesList.bind(null, { orgId, projectId, taskId, q: search })
      };
      return requestWrapper(resourcesApis[type]);
    }, {
      manual: true,
      formatResult: (res) => resetList(res.list),
      onSuccess: (data) => {
        if (data[0]) {
          setExpandedRowKeys([data[0].provider]);
        }
      }
    }
  );

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

  const onExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys([ ...expandedRowKeys, record.provider ]);
    } else {
      setExpandedRowKeys((expandedRowKeys.filter(d => d !== record.provider) || []));
    }
  };

  const columns = [
    {
      dataIndex: 'provider',
      title: '云平台',
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

  return (
    <>
     <Space size='middle' direction='vertical' style={{ width: '100%' }}>
       <Row justify='space-between'>
          <Input.Search
            placeholder='请输入关键字搜索'
            style={{ width: 240 }}
            onSearch={v => setSearch(v)}
          />
          <Button onClick={() => setMode('graph')} icon={<FundViewOutlined />}>切换图形展示</Button>
        </Row>
        <Table
          columns={columns}
          dataSource={resourceData}
          rowKey='provider'
          scroll={{ x: 'min-content', y: 570 }}
          loading={loading}
          pagination={false}
          expandedRowKeys={expandedRowKeys}
          onExpand={onExpand}
        /> 
      </Space>
      <ResourceViewModal event$={event$}/>
    </>
  );
};

export default TableLayout;
