import React, { useState, useEffect, useContext } from 'react';
import { Table, Input, Space, Button, Row, Tag } from 'antd';
import { useRequest } from 'ahooks';
import { FundViewOutlined } from "@ant-design/icons";
import { requestWrapper } from 'utils/request';
import envAPI from 'services/env';
import taskAPI from 'services/task';
import { t } from 'utils/i18n';
import DetailPageContext from '../../../detail-page-context';
import DetailDrawer from '../components/detail-drawer';

const TableLayout = ({ setMode }) => {

  const { taskId, type, orgId, projectId, envId } = useContext(DetailPageContext);
  const [ expandedRowKeys, setExpandedRowKeys ] = useState([]);
  const [ search, setSearch ] = useState('');
  const [ detailDrawerProps, setDetailDrawerProps ] = useState({
    visible: false
  });
 
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
        let obj = {
          isDrift: false
        };
        let children = list.filter(t => t.provider === d).map(it => {
          it.count = 1;
          if (it.isDrift) {
            obj.isDrift = true;
          }
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

  const onOpenDetailDrawer = (id) => {
    setDetailDrawerProps({
      visible: true, 
      id
    });
  };

  const onCloseDetailDrawer = () => {
    setDetailDrawerProps({ visible: false });
  };

  const columns = [
    {
      dataIndex: 'provider',
      title: '云平台',
      ellipsis: true,
      width: 220
    },
    {
      dataIndex: 'type',
      title: t('define.type'),
      ellipsis: true,
      width: 180
    },
    {
      dataIndex: 'count',
      title: '数量',
      ellipsis: true,
      width: 80
    },
    {
      dataIndex: 'name',
      title: t('define.name'),
      ellipsis: true,
      width: 200,
      render: (text, record) => {
        const { id } = record;
        return (
          <a onClick={() => onOpenDetailDrawer(id)}>
            {text}
          </a>
        );
      }
    },
    {
      dataIndex: 'module',
      title: '模块',
      ellipsis: true,
      width: 200
    },
    {
      dataIndex: 'isDrift',
      title: '是否漂移',
      ellipsis: true,
      width: 120,
      render: T => T ? <Tag color='green'>是</Tag> : <Tag>否</Tag>
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
          {type === 'env' && (
            <Button onClick={() => setMode('graph')} icon={<FundViewOutlined />}>切换图形展示</Button>
          )}
        </Row>
        <Table
          columns={columns}
          dataSource={resourceData}
          rowKey='provider'
          scroll={{ x: 'min-content' }}
          loading={loading}
          pagination={false}
          expandedRowKeys={expandedRowKeys}
          onExpand={onExpand}
        /> 
      </Space>
      {detailDrawerProps.visible && (
        <DetailDrawer {...detailDrawerProps} onClose={onCloseDetailDrawer} orgId={orgId} projectId={projectId} envId={envId} type={type}/>
      )}
    </>
  );
};

export default TableLayout;
