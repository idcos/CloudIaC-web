import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Input,
  Card,
  Space
} from "antd";
import { VerticalAlignTopOutlined, VerticalAlignBottomOutlined, FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";

import styles from './styles.less';
import SearchByKeyWord from './dom-event';

import {
  default as AnsiUp
} from 'ansi_up';

const ansi_up = new AnsiUp();
const searchService = new SearchByKeyWord({ 
  searchWrapperSelect: '.ansi-coder-content',
  excludeSearchClassNameList: [
    'line-index'
  ]
});

export default ({ value }) => {
  const [ fullScreen, setFullScreen ] = useState(false);
  const ansiCoderWrapperRef = useRef();
  const searchRef = useRef();
  const [ html, setHtml ] = useState('');

  useEffect(() => {
    const _html = value.map((line, index) => {
      return `
        <div class='ansi-line'>
          <span class='line-index'> ${index + 1 }</span>
          <pre class='line-text'>${ansi_up.ansi_to_html(line)}</pre>
        </div>
      `;
    }).join('');
    setHtml(_html);
    setTimeout(() => {
      go('bottom');
    });
  }, [value]);

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

  return (
    <Card
      className={`card-body-no-paading ${fullScreen ? "full-card" : ""} ${styles.ansiCodeCard}`}
      title={
        <Input.Search
          ref={searchRef}
          placeholder='请输入内容搜索'
          onSearch={(keyword) => {
            searchService.search(keyword);
            searchRef.current.focus();
          }}
          style={{ width: 240 }}
        />
      }
      extra={
        <Space>
          <Button onClick={() => go('top')}>
            <VerticalAlignTopOutlined />
            回顶部
          </Button>
          <Button onClick={() => go('bottom')}>
            <VerticalAlignBottomOutlined />
            回底部
          </Button>
          <Button onClick={() => setFullScreen(!fullScreen)}>
            {fullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            全屏显示
          </Button>
        </Space>
      }
    >
      <div className='ansi-coder-wrapper' ref={ansiCoderWrapperRef} >
        <div className='ansi-coder-content' dangerouslySetInnerHTML={{ __html: html }}>
        </div>
      </div>
    </Card>
  );
};
