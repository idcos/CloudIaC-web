import React, { useState, useRef } from "react";
import {
  Button,
  Input,
  Card,
  Space
} from "antd";
import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";

import Coder from "components/coder";

export default ({ coderHeight = 700, autoScrollToBottom = false, mode, value, cardStyle }) => {
  const [ fullScreen, setFullScreen ] = useState(false);
  const coderRef = useRef();
  return (
    <Card
      className={`card-body-no-paading ${fullScreen ? "full-card" : ""}`}
      cardStyle={cardStyle}
      title={
        <Input.Search
          placeholder='请输入内容搜索'
          onSearch={(keyword) => {
            coderRef.current.search(keyword);
          }}
          style={{ width: 240 }}
        />
      }
      extra={
        <Space>
          <Button onClick={() => setFullScreen(!fullScreen)}>
            {fullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            全屏显示
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
