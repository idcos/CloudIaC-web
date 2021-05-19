import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Input,
  Card,
  Space,
  Anchor
} from "antd";
import { VerticalAlignTopOutlined, VerticalAlignBottomOutlined, FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";

import Coder from "components/coder";
import styles from './styles.less';

import {
  default as AnsiUp
} from 'ansi_up';

const ansi_up = new AnsiUp();

export default ({ coderHeight = 700, autoScrollToBottom = false, mode, value }) => {
  const [ fullScreen, setFullScreen ] = useState(false);
  const [ lastKeyword, setLastKeyword ] = useState('');
  const ansiCoderWrapperRef = useRef();
  const searchRef = useRef();
  const [ html, setHtml ] = useState('');

  useEffect(() => {
    const _html = value.map((line, index) => {
      return `
        <div class='ansi-line'>
          <span class='line-index'> ${index + 1 }</span>
          ${ansi_up.ansi_to_html(line)}
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
      throw new Error('跳转失败');
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
            // if (keyword !== lastKeyword) {
            //   coderRef.current.search(keyword);
            //   setLastKeyword(keyword);
            // } else {
            //   execSearchCommand('findNext');
            // }
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
