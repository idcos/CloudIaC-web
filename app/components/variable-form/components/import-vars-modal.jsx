import React, { useState } from 'react';
import { Modal, Table } from 'antd';

export default (props) => {

  const { visible, defaultScope, varList, importVars, onClose, onFinish } = props;
  const [ selectedList, setSelectedList ] = useState({
    keys: [],
    rows: []
  });
  
  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      width: 180,
      ellipsis: true
    }, 
    {
      title: 'value',
      dataIndex: 'value',
      width: 180,
      ellipsis: true
    }, 
    {
      title: '描述信息',
      dataIndex: 'description',
      width: 180,
      ellipsis: true
    } 
  ];

  const rowSelection = {
    columnWidth: 26,
    selectedRowKeys: selectedList.keys,
    getCheckboxProps: (record) => {
      const hasSameName = !!varList.find(it => it.name === record.name);
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
    <Modal 
      width={720} 
      title='导入' 
      visible={visible} 
      onCancel={onCancel} 
      onOk={onOk}
      className='antd-modal-type-table'
      cancelButtonProps={{ 
        className: 'ant-btn-tertiary' 
      }}
    >
      <Table 
        columns={columns} 
        dataSource={importVars}
        scroll={{ x: 'min-content', y: 350 }} 
        pagination={false} 
        rowKey={(record) => record.name}
        rowSelection={rowSelection}
      />
    </Modal>
  );
};
