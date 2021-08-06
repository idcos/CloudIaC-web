import React, { useState, useRef } from "react";
import {
  Button,
  Input,
  Card,
  Space
} from "antd";
import { VerticalAlignTopOutlined, VerticalAlignBottomOutlined, FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";

import Coder from "components/coder";

export default ({ coderHeight = 700, autoScrollToBottom = false, mode, value }) => {
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

  return (
    <Card
      className={`coder-card card-body-no-paading ${fullScreen ? "full-card" : ""}`}
      title={
        <Input.Search
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
      extra={
        <Space>
          <Button onClick={() => coderRef.current.scrollToTop()}>
            <VerticalAlignTopOutlined />
            回顶部
          </Button>
          <Button onClick={() => coderRef.current.scrollToBottom()}>
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
      <Coder
        childRef={coderRef}
        options={{
          mode
        }}
        autoScrollToBottom={autoScrollToBottom}
        selfClassName='card-coder'
        style={{ height: coderHeight }}
        value={value}
        onChange={() => ""}
      />
    </Card>
  );
};
