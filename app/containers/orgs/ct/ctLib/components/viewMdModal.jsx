import React, { useState, useEffect } from 'react';
import { Modal, notification, Spin, Empty } from "antd";

import { ctAPI } from "services/base";
import MarkdownParser from 'components/coder/markdown-parser';


export default (props) => {

  const { visible, repoBranch, repoId, orgId, vcsId, onClose } = props;

  const [ codeStr, setCodeStr ] = useState('');
  const [ spinning, setSpinning ] = useState(false);

  useEffect(() => {
    if (visible) {
      getReadmeText();
    }
  }, [visible]);

  const getReadmeText = async () => {
    setSpinning(true);
    const res = await ctAPI.repoReadme({
      branch: repoBranch, 
      repoId, 
      orgId,
      vcsId
    });
    setSpinning(false);
    if (res.code !== 200) {
      notification.error({
        message: res.message
      });
    }
    const { content } = res.result || {};
    setCodeStr(content || '');
  };
  
  const onCancel = () => {
    reset();
    onClose();
  };

  const reset = () => {
    setCodeStr('');
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
      <Spin spinning={spinning}>
        <MarkdownParser value={codeStr} />
      </Spin>
    </Modal>
  );
};