import React, { useState } from "react";
import { Space, Affix } from "antd";
import classnames from 'classnames';
import { GLOBAL_SCROLL_DOM_ID } from 'constants/types';
import styles from './styles.less';

export default ({ children, offsetBottom = 0, align = 'center' } = {}) => {

  const [ affixed, setAffixed ] = useState(false);

  return (
    <Affix offsetBottom={offsetBottom} onChange={setAffixed} target={() => document.getElementById(GLOBAL_SCROLL_DOM_ID)}>
      <div style={{ textAlign: align }} className={classnames(styles.btn_wrapper, { [styles[`affixed`]]: affixed })}>
        <Space>
          {children}
        </Space>
      </div>
    </Affix>
  );
}