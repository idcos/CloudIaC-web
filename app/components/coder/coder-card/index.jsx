import React, { useState, useRef, useMemo } from "react";
import { Card, Space, Spin, Button } from "antd";
import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";
import noop from 'lodash/noop';
import classnames from 'classnames';
import Coder from "components/coder";
import styles from './styles.less';

export default ({ 
  height = 350,
  style,
  autoScrollToBottom = false, 
  options, 
  value,
  onChange = noop,
  title,
  spinning = false,
  tools=['fullScreen'],
  bodyPrefix,
}) => {
  const [ fullScreen, setFullScreen ] = useState(false);
  const coderRef = useRef();

  const setFullScreenClose = (e) => {
    if (e.keyCode === 27) {
      setFullScreen(false);
    }
  };

  const toolsEnum = {
    fullScreen: (
      <span 
        className={styles.tool} 
        onClick={() => setFullScreen(!fullScreen)} 
        onKeyDown={(e) => setFullScreenClose(e)}
      >
        {
          fullScreen ? (
            <>
              <FullscreenExitOutlined className={styles.tool_icon}/>
              <span className={styles.tool_text}>退出全屏</span> 
            </>
          ) : (
            <>
              <FullscreenOutlined className={styles.tool_icon}/>
              <span className={styles.tool_text}>全屏显示</span>
            </>
          )
        }
      </span>
    )
  };

  const Tools = useMemo(() => {
    return (
      <Space>
        {tools.map(tool => toolsEnum[tool])}
      </Space>
    );
  });

  return (
    <div
      className={
        classnames(
          styles.code_card,
          { [styles.full_screen_card]: fullScreen }
        )
      }
      style={{ height, ...style }}
    >
      <div className={styles.code_card_head}>
        <div className={styles.code_card_head_title}>
          <Space>
            <div className={styles.code_card_head_title_content}>{title}</div>
            {!fullScreen && Tools}
          </Space>
        </div>
        <div className={styles.code_card_head_extra}>
          {fullScreen && Tools}
        </div>
      </div>
      <div className={styles.code_card_body}>
        <Spin spinning={spinning}>
          <div className={styles.code_card_body_prefix}>
            {bodyPrefix}
          </div>
          <div className={styles.code_wrapper}>
            <Coder
              childRef={coderRef}
              options={options}
              autoScrollToBottom={autoScrollToBottom}
              selfClassName={styles.code_container}
              value={value}
              onChange={onChange}
            />
          </div>
        </Spin>
      </div>
    </div>
  );
};
