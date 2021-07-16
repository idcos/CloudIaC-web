import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Table } from 'antd';
import uuid from 'utils/uuid.js';

export default (props) => {

  const [ selectedList, setSelectedList ] = useState({
    keys: [],
    rows: []
  });
  
  const { visible, defaultScope, terraformVarList, importVars, onClose, onFinish } = props;
  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
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
    getCheckboxProps: (record) => {
      const hasSameName = !!terraformVarList.find(it => it.name === record.name);
      if (hasSameName) {
        return { disabled: true };
      } 
      return null;
    },
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
      sensitive: false,
      scope: defaultScope,
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
        dataSource={importVars}
        scroll={{ y: 465 }} 
        pagination={false} 
        rowKey={(record) => record.name}
        rowSelection={rowSelection}
      />
    </Modal>
  );
};
