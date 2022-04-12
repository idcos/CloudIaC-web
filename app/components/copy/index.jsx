import React, { useState } from 'react';
import { Button, Space, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { t } from 'utils/i18n';

export default ({ text, disabled, copyRequest, style }) => {

  const [ isCopied, setIsCopied] = useState(false);
  const [ copySuccess, setCopySuccess ] = useState(false);

  const runCopy = (copyText) => {
    try {
      const copyEle = document.createElement('div');
      copyEle.innerText = copyText;
      document.body.appendChild(copyEle);
      const range = document.createRange(); // 创造range
      window.getSelection().removeAllRanges(); //清除页面中已有的selection
      range.selectNode(copyEle); // 选中需要复制的节点
      window.getSelection().addRange(range); // 执行选中元素
      const copyStatus = document.execCommand("Copy"); // 执行copy操作
      setIsCopied(true);
      setCopySuccess(!!copyStatus);
      setTimeout(() => {
        setIsCopied(false);
        setCopySuccess(false);
      }, 3000);
      window.getSelection().removeAllRanges(); //清除页面中已有的selection
      document.body.removeChild(copyEle);
    } catch (error) {
      setIsCopied(true);
      setCopySuccess(false);
      setTimeout(() => {
        setIsCopied(false);
        setCopySuccess(false);
      }, 3000);
    }
  };

  const copy = () => {
    if (copyRequest) {
      copyRequest().then((text) => {
        runCopy(text);
      });
    } else {
      runCopy(text);
    }
  };

  return (
    <Button type='link' onClick={copy} disabled={disabled} style={{ padding: 0, ...style }}>
      <Space size={4}>
        <Tooltip title={t('$static.message.copyTooltip')}>
          <CopyOutlined />
        </Tooltip>
        {isCopied && (
          copySuccess ? (
            <span>{t('$static.message.copySuccess')}!</span>
          ) : (
            <span className='danger-text'>{t('$static.message.copyFail')}!</span>
          )
        )}
      </Space>
    </Button>
  );
};
