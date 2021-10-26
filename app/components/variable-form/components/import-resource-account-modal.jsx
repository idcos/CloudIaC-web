import React, { useEffect, useState } from 'react';
import { Modal, Table } from 'antd';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import varGroupAPI from 'services/var-group';

export default ({ event$, fetchParams, defaultScope, varGroupList = [] }) => {

  const { orgId } = fetchParams || {};
  const [ visible, setVisible ] = useState(false);
  const [ selectedRows, setSelectedRows ] = useState([]);
  const [ disabledKeys, setDisabledKeys ] = useState([]);

  useEffect(() => {
    if (visible) {
      const selectedRows = varGroupList.filter(varGroup => varGroup.objectType === defaultScope);
      const disabledKeys = varGroupList.filter(varGroup => varGroup.objectType !== defaultScope).map(it => it.varGroupId);
      setSelectedRows(selectedRows);
      setDisabledKeys(disabledKeys);
    }
  }, [visible]);

  // 列表查询
  const {
    loading: tableLoading,
    data: dataSource = [],
    run: fetchList,
    mutate: mutateTableData
  } = useRequest(
    (params) => requestWrapper(
      varGroupAPI.list.bind(null, { orgId, type: 'environment', ...params })
    ), {
      manual: true,
      formatResult: (res) => {
        return (res.list || []).map(it => {
          it.objectType = defaultScope;
          it.varGroupId = it.id;
          delete it.id;
          return it;
        });
      }
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
        dataSource={dataSource}
        pagination={false}
        rowKey='varGroupId'
        rowSelection={{
          hideSelectAll: true,
          getCheckboxProps: (record) => ({
            disabled: disabledKeys.includes(record.varGroupId)
          }),
          renderCell: (checked, record, index, originNode) => {
            console.log('record', record);
            console.log('selectedRows', selectedRows);
            return (
              <>
                {originNode}
              </>
            );
          },
          selectedRowKeys: selectedRows.map(({ varGroupId }) => varGroupId),
          onChange: (_selectedRowKeys, selectedRows) => setSelectedRows(selectedRows)
        }}
      />
    </Modal>
  );
}