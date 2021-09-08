import React, { useState } from 'react';
import { Card, Button, Space, Table, Alert, Drawer, Form } from 'antd';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { useSearchFormAndTable } from 'utils/hooks';
import policiesAPI from 'services/policies';
import SuppressFormDrawer from './suppress-form-drawer';

export default ({ policyId }) => {

  const [ visible, setVisible ] = useState(false);

  // 屏蔽列表查询
  const {
    loading: tableLoading,
    data: tableData,
    run: fetchList,
    refresh: refreshList
  } = useRequest(
    (params) => requestWrapper(
      policiesAPI.listSuppress.bind(null, params)
    ),
    {
      manual: true
    }
  );

  // 表单搜索和table关联hooks
  const { 
    tableProps
  } = useSearchFormAndTable({
    tableData,
    pagination: { hideOnSinglePage: true },
    onSearch: (params) => {
      const { current: currentPage, ...restParams } = params;
      fetchList({ currentPage, ...restParams, policyId });
    }
  });

  const columns = [
    {
      dataIndex: '',
      title: '屏蔽说明'
    },
    {
      dataIndex: 'targetType',
      title: '屏蔽类型',
    },
    {
      dataIndex: '',
      title: '操作人'
    },
    {
      dataIndex: '',
      title: '屏蔽时间'
    },
    {
      title: '操作'
    }
  ];

  const openSuppressFormDrawer = () => setVisible(true);

  const closeSuppressFormDrawer = () => setVisible(false);

  return (
    <Card title='屏蔽内容'>
      <Space direction='vertical' size='middle' style={{ width: '100%' }}>
        <Button type='primary' onClick={openSuppressFormDrawer}>按来源屏蔽</Button>
        <Table
          columns={columns}
          loading={tableLoading}
          {...tableProps}
        />
      </Space>
      <SuppressFormDrawer visible={visible} onClose={closeSuppressFormDrawer}/>
    </Card>
  );
};