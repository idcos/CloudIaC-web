import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Table } from 'antd';
import uuid from 'utils/uuid.js';

export default (props) => {

  const [ selectedList, setSelectedList ] = useState({
    keys: [],
    rows: []
  });
  
  const { visible, dataSource, onClose, onFinish } = props;
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
    selectedRowKeys: selectedList.keys,
    onChange: (keys, rows) => {
      setSelectedList({
        keys,
        rows
      });
    }
  };

  const onCancel = () => {
    reset();
    onClose();
  };

  const onOk = () => {
    const params = selectedList.rows.map((it) => ({
      type: 'terraform',
      id: uuid(),
      isSecret: false,
      ...it
    }));
    onFinish(params, () => {
      reset();
      onClose();
    });
  };

  const reset = () => {
    setSelectedList({
      keys: [],
      rows: []
    });
  };
  
  return (
    <Modal width={795} title='添加/编辑terraform变量' visible={visible} onCancel={onCancel} onOk={onOk}>
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
