import React, { useState, useEffect } from 'react';
import { Modal, Form, Input } from "antd";

import MDParser from 'components/coder/markdown-parser/index.jsx';


export default (props) => {

  const { visible, id, onClose } = props;
  
  const onCancel = () => {
    onClose();
  };
  
  return (
    <Modal 
      bodyStyle={{ maxHeight: 644, overflowY: 'scroll' }} 
      title='查看Readme.md文档' 
      visible={visible} 
      onCancel={onCancel}
      width={1032}
      footer={null}
    >
      <MDParser/>
    </Modal>
  );
};