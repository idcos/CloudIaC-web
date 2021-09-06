import React, { useState, useRef } from "react";
import {
  Button,
  Input,
  Card,
  Space
} from "antd";
import { VerticalAlignTopOutlined, VerticalAlignBottomOutlined, FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";
import Coder from "components/coder";
import noop from 'lodash/noop';

export default ({ 
  coderHeight = '100%', 
  bodyStyle,
  autoScrollToBottom = false, 
  options, 
  value,
  onChange = noop,
  title,
  showSearch = false,
  tools=['scrollTop', 'scrollBottom', 'fullScreen'],
  bodyBefore,
  ...props
}) => {
  const [ fullScreen, setFullScreen ] = useState(false);
  const [ lastKeyword, setLastKeyword ] = useState('');
  const coderRef = useRef();
  const searchRef = useRef();

  /**
	 * 搜索扩展功能 如上一个，下一个
	 * @param {'findPrev' | 'findNext'} command 
	 */
  const execSearchCommand = (command) => {
    const { value } = searchRef.current.state;
    if (!value) {
      return; 
    }
    if (value !== lastKeyword) {
      coderRef.current.search(value);
      setLastKeyword(value);
    } else {
      coderRef.current.execCommand(command);
    }
  };
  
  const setFullScreenClose = (e) => {
    if (e.keyCode === 27) {
      setFullScreen(false);
    }
  };

  const toolsEnum = {
    scrollTop: (
      <Button onClick={() => coderRef.current.scrollToTop()}>
        <VerticalAlignTopOutlined />
        回顶部
      </Button>
    ),
    scrollBottom: (
      <Button onClick={() => coderRef.current.scrollToBottom()}>
        <VerticalAlignBottomOutlined />
        回底部
      </Button>
    ),
    fullScreen: (
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
    )
  };

  return (
    <Card
      className={`coder-card card-body-no-paading ${fullScreen ? "full-card" : ""}`}
      title={
        <>
          {title}
          {
            showSearch && !title && <Input.Search
              ref={searchRef}
              placeholder='请输入内容搜索'
              onSearch={(keyword) => {
                if (keyword !== lastKeyword) {
                  coderRef.current.search(keyword);
                  setLastKeyword(keyword);
                } else {
                  execSearchCommand('findNext');
                }
                searchRef.current.focus();
              }}
              style={{ width: 240 }}
            />
          }
        </>
      }
      extra={
        <Space>
          {tools.map(tool => toolsEnum[tool])}
        </Space>
      }
      bodyStyle={{ ...bodyStyle, overflow: 'hidden' }}
      {...props}
    >
      {bodyBefore}
      <Coder
        childRef={coderRef}
        options={options}
        autoScrollToBottom={autoScrollToBottom}
        selfClassName='card-coder'
        style={{ height: coderHeight }}
        value={value}
        onChange={onChange}
      />
    </Card>
  );
};
