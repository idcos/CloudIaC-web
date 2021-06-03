import React, { useState, useEffect } from 'react';
import { Modal, Form, Input } from "antd";

import MarkdownParser from 'components/coder/markdown-parser';


export default (props) => {

  const { visible, id, onClose } = props;
  
  const onCancel = () => {
    onClose();
  };
  
  return (
    <Modal 
      bodyStyle={{ maxHeight: 557, overflowY: 'scroll' }} 
      title='查看Readme.md文档' 
      visible={visible} 
      onCancel={onCancel}
      width={1032}
      footer={null}
    >
      <MarkdownParser value='无' />
    </Modal>
  );
};