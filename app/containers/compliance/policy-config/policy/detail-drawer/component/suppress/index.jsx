import React, { useState } from 'react';
import { Card, Button, Space, Table, Modal, Popconfirm } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { useSearchFormAndTable } from 'utils/hooks';
import policiesAPI from 'services/policies';
import SuppressFormDrawer from './suppress-form-drawer';
import { TARGET_TYPE_ENUM, SUPPRESS_TYPE_ENUM } from 'constants/types';
import { t } from 'utils/i18n';

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
      title: t('define.name'),
      width: 170,
      ellipsis: true
    },
    {
      dataIndex: 'targetType',
      title: t('define.type'),
      width: 75,
      ellipsis: true,
      render: (text) => TARGET_TYPE_ENUM[text]
    },
    {
      dataIndex: 'type',
      title: t('define.suppress.field.type'),
      width: 120,
      ellipsis: true,
      render: (text) => SUPPRESS_TYPE_ENUM[text]
    },
    {
      dataIndex: 'reason',
      title: t('define.suppress.field.reason'),
      width: 149,
      ellipsis: true
    },
    {
      dataIndex: 'creator',
      title: t('define.suppress.field.creator'),
      width: 72,
      ellipsis: true
    },
    {
      dataIndex: 'createdAt',
      title: t('define.suppress.field.createdAt'),
      width: 123,
      ellipsis: true,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm')
    },
    {
      title: t('define.action'),
      width: 50,
      ellipsis: true,
      fixed: 'right',
      render: (record) => {
        const { id } = record;
        const { loading: delLoading } = delOneSuppressFetches[id] || {};
        return <Popconfirm
          title={t('define.suppress.action.delete.confirm.title')}
          onConfirm={() => delOneSuppress(id)}
        >
          <Button type='link' style={{ padding: 0, fontSize: 12 }} loading={delLoading}>{t('define.action.delete')}</Button>
        </Popconfirm>
      }
    }
  ];

  const openSuppressFormDrawer = () => setVisible(true);

  const closeSuppressFormDrawer = () => setVisible(false);

  const onSuppressPolicy = () => {
    Modal.confirm({
      width: 480,
      title: t('define.suppress.confirm.title'),
      content: t('define.suppress.confirm.content'),
      icon: <InfoCircleFilled />,
      cancelButtonProps: {
        className: 'ant-btn-tertiary' 
      },
      onOk: suppressPolicy
    });
  };

  return (
    <Card title={t('define.suppress.title')} bodyStyle={{ minHeight: 300 }} type='inner'>
      <Space direction='vertical' size='middle' style={{ width: '100%' }}>
        <Space>
          <Button type='primary' onClick={onSuppressPolicy} disabled={!enabled}>
            {t('define.suppressType.policy')}
          </Button>
          <Button onClick={openSuppressFormDrawer} disabled={!enabled}>
            {t('define.suppressType.source')}
          </Button>
        </Space>
        <Table
          columns={columns}
          loading={tableLoading}
          scroll={{ x: 'min-content' }}
          {...tableProps}
        />
      </Space>
      {
        visible && <SuppressFormDrawer policyId={policyId} visible={visible} reload={reloadSuppressList} onClose={closeSuppressFormDrawer}/>
      }
    </Card>
  );
};