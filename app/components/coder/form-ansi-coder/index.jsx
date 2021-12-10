import React, { useRef, useState } from "react";
import { Space } from "antd";
import { FullscreenExitOutlined, FullscreenOutlined, CopyOutlined } from "@ant-design/icons";
import { useFullscreen, useThrottleEffect } from 'ahooks';
import { default as AnsiUp } from 'ansi_up';
import classNames from 'classnames';
import { getNumLen } from 'utils/util';
import copy from 'utils/copy';
import styles from './styles.less';

const ansi_up = new AnsiUp();

export default ({ 
  value,
  title,
}) => {

  const ref = useRef();
  const [ isFullscreen, { toggleFull } ] = useFullscreen(ref);
  const [ html, setHtml ] = useState('');

  useThrottleEffect(
    () => {
      if (typeof value === 'string') {
        value = value ? value.split('\n') : [];
      }
      const maxLineIndexLen = getNumLen(value.length);
      const lineIndexWidth = 16 + 8.5 * maxLineIndexLen;
      const _html = value.map((line, index) => {
        return `
          <div class='ansi-line' style='padding-left: ${lineIndexWidth}px;'>
            <span class='line-index' style='width: ${lineIndexWidth}px;'>${index + 1 }</span>
            <pre class='line-text reset-styles'>${ansi_up.ansi_to_html(line)}</pre>
          </div>
        `;
      }).join('');
      setHtml(_html);
    },
    [value],
    {
      wait: 100
    }
  );

  return (
    <div ref={ref} className={classNames(styles.formAnsiCoder)}>
      <div className='header'>
        <div>{title}</div>
        <Space className='extra'>
          <div className='tool-item' onClick={toggleFull}>
            {
              isFullscreen ? (
                <>
                  <FullscreenExitOutlined className='icon'/>
                  <span>退出全屏</span> 
                </>
              ) : (
                <>
                  <FullscreenOutlined className='icon'/>
                  <span>全屏显示</span>
                </>
              )
            }
          </div>
          <div className='tool-item' onClick={() => copy(value)}>
            <CopyOutlined className='icon'/>
            <span>复制内容</span>
          </div>
        </Space>
      </div>
      <div className='body'>
        <div className='ansi-coder-content' dangerouslySetInnerHTML={{ __html: html }}>
        </div>
      </div>
    </div>
  );
};
