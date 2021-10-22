import React, { useState } from 'react';
import { Modal, Table } from 'antd';
import { useRequest } from 'ahooks';
import moment from 'moment';
import { requestWrapper } from 'utils/request';
import varGroupAPI from 'services/var-group';

export default ({ event$, fetchParams }) => {

  const { orgId } = fetchParams || {};
  const [ visible, setVisible ] = useState(false);
  const [ selectedRows, setSelectedRows ] = useState([]);

  // 列表查询
  const {
    loading: tableLoading,
    data: tableData = {},
    run: fetchList,
    mutate: mutateTableData
  } = useRequest(
    (params) => requestWrapper(
      varGroupAPI.list.bind(null, { orgId, type: 'environment', ...params })
    ), {
      manual: true
    }
  );

  const onOpen = () => {
    setVisible(true);
    fetchList({ currentPage: 1, pageSize: 100000 });
  };

  const onCancel = () => {
    setVisible(false);
    mutateTableData({});
  };

  const onOk = () => {
    event$.emit({ 
      type: 'import-resource-account',
      data: {
        importResourceAccountList: selectedRows
      } 
    });
    setSelectedRows([]);
    setVisible(false);
  };

  const columns = [
    {
      dataIndex: 'name',
      title: '账号描述',
      width: 200,
      ellipsis: true
    },
    {
      dataIndex: 'creator',
      title: '创建人',
      width: 140,
      ellipsis: true
    },
    {
      dataIndex: 'updatedAt',
      title: '更新时间',
      width: 200,
      ellipsis: true,
      render: (text) => moment(text).format('YYYY-MM-DD hh:mm')
    }
  ];

  event$.useSubscription(({ type }) => {
    switch (type) {
      case 'open-import-resource-account-modal':
        onOpen();
        break;
      default:
        break;
    }
  });

  return (
    <Modal 
      title='资源账号' 
      visible={visible} 
      onCancel={onCancel} 
      onOk={onOk}
      width={600}
      bodyStyle={{ padding: 0 }}
    >
      <Table 
        style={{ marginBottom: 14 }}
        columns={columns}
        scroll={{ x: 'min-content', y: 258 }}
        loading={tableLoading}
        dataSource={tableData.list || []}
        pagination={false}
        rowKey='id'
        rowSelection={{
          hideSelectAll: true,
          selectedRowKeys: selectedRows.map(({ id }) => id),
          onChange: (_selectedRowKeys, selectedRows) => setSelectedRows(selectedRows)
        }}
      />
    </Modal>
  );
}