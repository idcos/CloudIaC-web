import React, { useState } from 'react';
import { Space, Table, Button, Popconfirm } from 'antd';
import { useRequest, useEventEmitter } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { useSearchFormAndTable } from 'utils/hooks';
import varGroupAPI from 'services/var-group';
import FormModal from './form-modal';

export default ({ orgId }) => {

  const [ formModalProps, setFormModalProps ] = useState({
    visible: false
  });

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
      title: '账号描述',
      width: 370,
      ellipsis: true
    },
    {
      dataIndex: '',
      title: '创建人',
      width: 270,
      ellipsis: true
    },
    {
      dataIndex: '',
      title: '更新时间',
      width: 344,
      ellipsis: true
    },
    {
      title: '操作',
      width: 170,
      render: (_text, record) => {
        const { id } = record;
        const { loading: delLoading = false } = delFetches[id] || {};
        return (
          <div className='common-table-btn-wrapper'>
            <Button type='link' onClick={() => editResourceAccount(id)}>编辑</Button>
            <Popconfirm
              title='确定要删除该资源账号？'
              onConfirm={() => delResourceAccount({ id })}
            >
              <Button type='link' loading={delLoading}>删除</Button>
            </Popconfirm>
          </div>
        );
      }
    }
  ];

  const addResourceAccount = () => {
    setFormModalProps({ visible: true });
  };

  const editResourceAccount = (id) => {
    setFormModalProps({ visible: true, id });
  };

  const event$ = useEventEmitter();
  event$.useSubscription((type) => {
    switch (type) {
      case 'close':
        setFormModalProps({ visible: false });
        break;
      case 'refresh':
        refresh();
        break;
      default:
        break;
    }
  });

  return (
    <Space size='middle' direction='vertical' style={{ width: '100%', display: 'flex' }}>
      <Button type='primary' onClick={addResourceAccount}>添加资源账号</Button>
      <Table
        columns={columns}
        scroll={{ x: 'min-content', y: 430 }}
        loading={tableLoading}
        {...tableProps}
      />
      {
        formModalProps.visible && <FormModal {...formModalProps} orgId={orgId} event$={event$}/>
      }
    </Space>
  );
};
