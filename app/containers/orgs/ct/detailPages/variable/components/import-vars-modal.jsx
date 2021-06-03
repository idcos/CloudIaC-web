import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Table } from 'antd';

export default (props) => {

  const [ selectedRowKeys, setSelectedRowKeys ] = useState([]);
  
  const { visible, dataSource, onClose } = props;
  const columns = [
    {
      title: 'key',
      dataIndex: 'key',
      width: 200
    }, 
    {
      title: 'value',
      dataIndex: 'value',
      width: 200
    }, 
    {
      title: '描述信息',
      dataIndex: 'description'
    } 
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys)
  };

  const onCancel = () => {
    setSelectedRowKeys([]);
    onClose();
  };
  
  return (
    <Modal width={795} title='添加/编辑terraform变量' visible={visible} onCancel={onCancel}>
      <Table 
        columns={columns} 
        dataSource={dataSource}
        scroll={{ y: 465 }} 
        pagination={false} 
        rowKey={(record) => record.key}
        rowSelection={rowSelection}
      />
    </Modal>
  );
};
