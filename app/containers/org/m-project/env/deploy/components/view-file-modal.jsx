import React from 'react';
import { Modal } from 'antd';

export default ({ title, visible, content, onClose }) => {

  return (
    <Modal 
      title={title} 
      visible={visible}
      footer={null}
      onCancel={onClose}
    >
      {content}
    </Modal>
  );
}