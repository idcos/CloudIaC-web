import React, { useRef } from "react";
import { Space } from "antd";
import { FullscreenExitOutlined, FullscreenOutlined, CopyOutlined } from "@ant-design/icons";
import noop from 'lodash/noop';
import { useFullscreen } from 'ahooks';
import classNames from 'classnames';
import Coder from "components/coder";
import copy from 'utils/copy';
import { t } from 'utils/i18n';
import styles from './styles.less';

export default ({ 
  autoScrollToBottom = false, 
  options, 
  value,
  title,
  onChange = noop
}) => {

  const ref = useRef();
  const [ isFullscreen, { toggleFull } ] = useFullscreen(ref);

  return (
    <div ref={ref} className={classNames(styles.formCoder)}>
      <div className='header'>
        <div>{title}</div>
        <Space className='extra'>
          <div className='tool-item' onClick={toggleFull}>
            {
              isFullscreen ? (
                <>
                  <FullscreenExitOutlined className='icon'/>
                  <span>{t('define.action.exitFullScreen')}</span> 
                </>
              ) : (
                <>
                  <FullscreenOutlined className='icon'/>
                  <span>{t('define.action.fullScreen')}</span>
                </>
              )
            }
          </div>
          <div className='tool-item' onClick={() => copy(value)}>
            <CopyOutlined className='icon'/>
            <span>{t('define.action.copyContent')}</span>
          </div>
        </Space>
      </div>
      <div className='body'>
        <Coder
          selfClassName='form-coder-cotent'
          options={options}
          autoScrollToBottom={autoScrollToBottom}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
