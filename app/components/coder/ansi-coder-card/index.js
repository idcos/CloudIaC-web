import React, { useState, useRef } from "react";
import { Button, Input, Card, Space } from "antd";
import { VerticalAlignTopOutlined, VerticalAlignBottomOutlined, FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";
import { default as AnsiUp } from 'ansi_up';
import { useThrottleEffect } from 'ahooks';

import { getNumLen } from 'utils/util';

import styles from './styles.less';
import SearchByKeyWord from './dom-event';

const ansi_up = new AnsiUp();
const searchService = new SearchByKeyWord({ 
  searchWrapperSelect: '.ansi-coder-content',
  excludeSearchClassNameList: [
    'line-index'
  ]
});

export default ({ value, cardTitleAfter, showHeader, ansiCoderWrapperHeight = 350 }) => {
  const [ fullScreen, setFullScreen ] = useState(false);
  const ansiCoderWrapperRef = useRef();
  const searchRef = useRef();
  const [ html, setHtml ] = useState('');

  useThrottleEffect(
    () => {
      const maxLineIndexLen = getNumLen(value.length);
      const lineIndexWidth = 6 + 8.5 * maxLineIndexLen;
      const _html = value.map((line, index) => {
        return `
          <div class='ansi-line' style='padding-left: ${lineIndexWidth}px;'>
            <span class='line-index' style='width: ${lineIndexWidth}px;'>${index + 1 }</span>
            <pre class='line-text reset-styles'>${ansi_up.ansi_to_html(line)}</pre>
          </div>
        `;
      }).join('');
      setHtml(_html);
      setTimeout(() => {
        go('bottom');
      });
    },
    [value],
    {
      wait: 100
    }
  );

  const go = (type) => {
    try {
      const scrollDom = ansiCoderWrapperRef.current;
      let top;
      switch (type) {
      case 'top':
        top = 0;
        break;
      case 'bottom':
        top = scrollDom.scrollHeight;
        break;
      
      default:
        break;
      }
      scrollDom.scrollTo({
        top,
        behavior: 'smooth'
      });
    } catch (error) {
      console.log('滚动定位失败');
    }
  };
  const setFullScreenClose = (e) => {
    if (e.keyCode === 27) {
      setFullScreen(false);
    }
  };
  return (
    <Card
      className={`card-body-no-paading ${fullScreen ? "full-card" : ""} ${styles.ansiCodeCard}`}
      title={
        !showHeader && <>
          <Input.Search
            ref={searchRef}
            placeholder='请输入内容搜索'
            onSearch={(keyword) => {
              searchService.search(keyword);
              searchRef.current.focus();
            }}
            style={{ width: 240 }}
          />
          <div className='title-after'>
            {cardTitleAfter}
          </div>
        </>
      }
      extra={
        !showHeader && <Space>
          <Button onClick={() => go('top')}>
            <VerticalAlignTopOutlined />
            回顶部
          </Button>
          <Button onClick={() => go('bottom')}>
            <VerticalAlignBottomOutlined />
            回底部
          </Button>
          <Button onClick={() => setFullScreen(!fullScreen)} onKeyDown={(e) => setFullScreenClose(e)}>
            {
              fullScreen ? (
                <>
                  <FullscreenExitOutlined />&nbsp;退出全屏
                </>
              ) : (
                <>
                  <FullscreenOutlined />&nbsp;全屏显示
                </>
              )
            }
          </Button>
        </Space>
      }
    >
      <div className='ansi-coder-wrapper' style={{ height: ansiCoderWrapperHeight }} ref={ansiCoderWrapperRef} >
        <div className='ansi-coder-content' dangerouslySetInnerHTML={{ __html: html }}>
        </div>
      </div>
    </Card>
  );
};
