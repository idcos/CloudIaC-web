import React, { useState } from 'react';
import { Card, Button, Space, Table, Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { useSearchFormAndTable } from 'utils/hooks';
import policiesAPI from 'services/policies';
import SuppressFormDrawer from './suppress-form-drawer';
import { SCOPE_ENUM } from 'constants/types';

export default ({ policyId, detailInfo: { enabled } = {} }) => {

  const [ visible, setVisible ] = useState(false);

  // 屏蔽列表查询
  const {
    loading: tableLoading,
    data: tableData,
    run: fetchList,
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
    tableProps,
    resetPageCurrent
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
      dataIndex: 'targetName',
      title: '名称'
    },
    {
      dataIndex: 'targetType',
      title: '类型',
      render: (text) => SCOPE_ENUM[text]
    },
    {
      dataIndex: 'type',
      title: '屏蔽类型'
    },
    {
      dataIndex: 'reason',
      title: '屏蔽说明'
    },
    {
      dataIndex: 'creator',
      title: '操作人'
    },
    {
      dataIndex: 'createdAt',
      title: '屏蔽时间',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '操作',
      render: () => {
        return <Button type='link' style={{ padding: 0 }}>删除</Button>
      }
    }
  ];

  const openSuppressFormDrawer = () => setVisible(true);

  const closeSuppressFormDrawer = () => setVisible(false);

  const suppressPolicy = () => {
    Modal.confirm({
      width: 480,
      title: '你确定要屏蔽此策略吗？',
      content: '屏蔽此策略后，所有应用该策略的云模板和环境都将在检测过程中忽略此策略',
      icon: <ExclamationCircleFilled />,
      okText: '确认',
    	cancelText: '取消',
      onOk: () => {
        console.log('onOk');
      }
    });
  };

  return (
    <Card title='屏蔽内容' bodyStyle={{ minHeight: 300 }} type='inner'>
      <Space direction='vertical' size='middle' style={{ width: '100%' }}>
        <Space>
          <Button type='primary' onClick={suppressPolicy} disabled={!enabled}>屏蔽此策略</Button>
          <Button onClick={openSuppressFormDrawer} disabled={!enabled}>按来源屏蔽</Button>
        </Space>
        <Table
          columns={columns}
          loading={tableLoading}
          {...tableProps}
        />
      </Space>
      {
        visible && <SuppressFormDrawer policyId={policyId} visible={visible} reload={resetPageCurrent} onClose={closeSuppressFormDrawer}/>
      }
    </Card>
  );
};