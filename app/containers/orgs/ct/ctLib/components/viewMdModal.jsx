import React, { useState, useEffect } from 'react';
import { Modal, notification } from "antd";

import { ctAPI } from "services/base";
import MarkdownParser from 'components/coder/markdown-parser';


export default (props) => {

  const { visible, repoBranch, repoId, orgId, onClose } = props;

  const [ codeStr, setCodeStr ] = useState('');

  useEffect(() => {
    if (visible) {
      getReadmeText();
    }
  }, [visible]);

  const getReadmeText = async () => {
    const res = await ctAPI.repoReadme({
      branch: repoBranch, 
      repoId, 
      orgId
    });
    if (res.code !== 200) {
      notification.error({
        message: res.message
      });
    }
    const { content } = res.result || {};
    setCodeStr(content || '');
  };
  
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
      <MarkdownParser value={codeStr} />
    </Modal>
  );
};