import React, { useState } from 'react';
import { Space, Table, Button, Popconfirm } from 'antd';
import { useRequest, useEventEmitter } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { useSearchFormAndTable } from 'utils/hooks';
import varGroupAPI from 'services/var-group';
import FormModal from './form-modal';
import moment from 'moment';
import { t } from 'utils/i18n';

export default ({ orgId }) => {
  // 列表查询
  const {
    loading: tableLoading,
    data: tableData,
    refresh,
    run: fetchList
  } = useRequest(
    (params) => requestWrapper(
      varGroupAPI.list.bind(null, { orgId, ...params })
    ), {
      throttleInterval: 1000, // 节流
      manual: true
    }
  );

  // 表单搜索和table关联hooks
  const { 
    tableProps
  } = useSearchFormAndTable({
    tableData,
    onSearch: (params) => {
      const { current: currentPage, ...restParams } = params;
      fetchList({ 
        currentPage,
        ...restParams 
      });
    }
  });

  // 删除
  const {
    run: delResourceAccount,
    fetches: delFetches
  } = useRequest(
    ({ id }) => requestWrapper(
      varGroupAPI.del.bind(null, { orgId, id }),
      { 
        autoSuccess: true 
      }
    ), {
      manual: true,
      fetchKey: ({ id }) => id,
      onSuccess: () => refresh()
    }
  );

  const columns = [
    {
      dataIndex: 'name',
      title: t('define.des'),
      width: 207,
      ellipsis: true
    },
    {
      dataIndex: 'projectNames',
      title: t('define.ct.import.init.associatedProject'),
      width: 286,
      ellipsis: true,
      render: (projectNames) => {
        if (projectNames && projectNames.length > 0) {
          return (projectNames || []).join('、'); 
        } else {
          return t('define.allProject');
        }
      }
    },
    {
      dataIndex: 'provider',
      title: 'Provider',
      width: 80,
      ellipsis: true
    },
    {
      dataIndex: 'costCounted',
      title: t('define.costStatistics'),
      width: 80,
      ellipsis: true,
      render: (text) => text ? t('define.yes') : t('define.no')

    },
    {
      dataIndex: 'creator',
      title: t('define.creator'),
      width: 100,
      ellipsis: true
    },
    {
      dataIndex: 'updatedAt',
      title: t('define.updateTime'),
      width: 150,
      ellipsis: true,
      render: (text) => moment(text).format('YYYY-MM-DD hh:mm')
    },
    {
      title: t('define.action'),
      width: 150,
      fixed: 'right',
      render: (_text, record) => {
        const { id } = record;
        const { loading: delLoading = false } = delFetches[id] || {};
        return (
          <div className='common-table-btn-wrapper'>
            <Button type='link' onClick={() => event$.emit({ type: 'open-resource-account-form-modal', data: { id } })}>{t('define.action.modify')}</Button>
            <Popconfirm
              title={t('define.resourceAccount.action.delect.confirm.title')}
              onConfirm={() => delResourceAccount({ id })}
            >
              <Button type='link' loading={delLoading}>{t('define.action.delect')}</Button>
            </Popconfirm>
          </div>
        );
      }
    }
  ];

  const event$ = useEventEmitter();
  event$.useSubscription(({ type }) => {
    switch (type) {
    case 'refresh':
      refresh();
      break;
    default:
      break;
    }
  });

  return (
    <Space size='middle' direction='vertical' style={{ width: '100%', display: 'flex' }}>
      <Button type='primary' onClick={() => event$.emit({ type: 'open-resource-account-form-modal' })}>{t('define.resourceAccount.action.add')}</Button>
      <Table
        columns={columns}
        scroll={{ x: 'min-content' }}
        loading={tableLoading}
        {...tableProps}
      />
      <FormModal orgId={orgId} event$={event$}/>
    </Space>
  );
};
