import React, { useState } from 'react';
import { Card, Button, Space, Table, Modal, Popconfirm } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { useSearchFormAndTable } from 'utils/hooks';
import policiesAPI from 'services/policies';
import SuppressFormDrawer from './suppress-form-drawer';
import { TARGET_TYPE_ENUM, SUPPRESS_TYPE_ENUM } from 'constants/types';

export default ({ policyId, detailInfo: { enabled } = {}, reloadPolicyDetailAndList }) => {

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

  // 屏蔽此策略
  const {
    run: suppressPolicy
  } = useRequest(
    () => requestWrapper(
      policiesAPI.updateSuppress.bind(null, { policyId, addTargetIds: [policyId] }),
      {
        autoSuccess: true
      }
    ),
    {
      manual: true,
      onSuccess: () => {
        reloadSuppressList();
        reloadPolicyDetailAndList();
      }
    }
  );

  // 删除单条屏蔽
  const {
    run: delOneSuppress,
    fetches: delOneSuppressFetches
  } = useRequest(
    (suppressId) => requestWrapper(
      policiesAPI.delOneSuppress.bind(null, { policyId, suppressId }),
      {
        autoSuccess: true
      }
    ),
    {
      manual: true,
      fetchKey: (suppressId) => suppressId,
      onSuccess: () => {
        reloadSuppressList();
        reloadPolicyDetailAndList();
      }
    }
  );

  // 重新加载屏蔽列表
  const reloadSuppressList = () => {
    resetPageCurrent();
  };

  const columns = [
    {
      dataIndex: 'targetName',
      title: '名称',
      width: 170,
      ellipsis: true
    },
    {
      dataIndex: 'targetType',
      title: '类型',
      width: 75,
      ellipsis: true,
      render: (text) => TARGET_TYPE_ENUM[text]
    },
    {
      dataIndex: 'type',
      title: '屏蔽类型',
      width: 86,
      ellipsis: true,
      render: (text) => SUPPRESS_TYPE_ENUM[text]
    },
    {
      dataIndex: 'reason',
      title: '屏蔽说明',
      width: 149,
      ellipsis: true
    },
    {
      dataIndex: 'creator',
      title: '操作人',
      width: 72,
      ellipsis: true
    },
    {
      dataIndex: 'createdAt',
      title: '屏蔽时间',
      width: 123,
      ellipsis: true,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '操作',
      width: 50,
      ellipsis: true,
      fixed: 'right',
      render: (record) => {
        const { id } = record;
        const { loading: delLoading } = delOneSuppressFetches[id] || {};
        return <Popconfirm
          title='确定要删除该屏蔽内容？'
          onConfirm={() => delOneSuppress(id)}
        >
          <Button type='link' style={{ padding: 0, fontSize: 12 }} loading={delLoading}>删除</Button>
        </Popconfirm>
      }
    }
  ];

  const openSuppressFormDrawer = () => setVisible(true);

  const closeSuppressFormDrawer = () => setVisible(false);

  const onSuppressPolicy = () => {
    Modal.confirm({
      width: 480,
      title: '你确定要屏蔽此策略吗？',
      content: '屏蔽此策略后，所有应用该策略的云模板和环境都将在检测过程中忽略此策略',
      icon: <ExclamationCircleFilled />,
      okText: '确认',
    	cancelText: '取消',
      onOk: suppressPolicy
    });
  };

  return (
    <Card title='屏蔽内容' bodyStyle={{ minHeight: 300 }} type='inner'>
      <Space direction='vertical' size='middle' style={{ width: '100%' }}>
        <Space>
          <Button type='primary' onClick={onSuppressPolicy} disabled={!enabled}>
            屏蔽此策略
          </Button>
          <Button onClick={openSuppressFormDrawer} disabled={!enabled}>
            按来源屏蔽
          </Button>
        </Space>
        <Table
          columns={columns}
          loading={tableLoading}
          scroll={{ x: 'min-content', y: 570 }}
          {...tableProps}
        />
      </Space>
      {
        visible && <SuppressFormDrawer policyId={policyId} visible={visible} reload={reloadSuppressList} onClose={closeSuppressFormDrawer}/>
      }
    </Card>
  );
};