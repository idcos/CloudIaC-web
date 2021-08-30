import React, { memo, useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Collapse } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

import { ENV_STATUS, AUTO_DESTROY, ENV_STATUS_COLOR } from 'constants/types';
import AnsiCoderCard from "components/coder/ansi-coder-card/index";
import { Eb_WP } from 'components/error-boundary';
import { timeUtils } from "utils/time";
import moment from 'moment';
import styles from './style.less';

const { Panel } = Collapse;

const Index = (props) => {

  const { info, taskInfo } = props;

  const [ now, setNow ] = useState(moment());

  useEffect(() => {
    const t = setInterval(() => {
      setNow(moment());
    }, 1000);
    return () => {
      clearInterval(t);
    };
  }, []);

  const formatTTL = ({ autoDestroyAt, ttl }) => {
    if (autoDestroyAt) {
      return timeUtils.diff(autoDestroyAt, now, '-');
    }
    switch (ttl) {
    case '':
    case null:
    case undefined:
      return '-';
    case 0:
    case '0':
      return '不限制';
    default:
      const it = AUTO_DESTROY.find(d => d.code === ttl) || {};
      return it.name;
    }
  };
  const a = true;
  return <>
    <div className={styles['collapse-title']}>策略1</div>
    <div className={styles[a ? 'color-collapse-pass' : 'color-collapse-inject']}>
      <Collapse expandIconPosition={'right'}>
        <Panel showArrow={false}
          header={a ? (
            <span><span style={{ color: '#13C2C2', paddingRight: 8 }}><CheckCircleOutlined />  通过</span><span>策略1</span></span>
          ) : <span><span style={{ color: '#CF1322', paddingRight: 8 }}><CloseCircleOutlined />  失败</span><span>策略1</span></span>} 
          key='1'
        >
          <AnsiCoderCard 
            showHeader={true}
            value={['aawdadwaawda']} 
          />
        </Panel>
      </Collapse>
    </div>
  </>;
};

export default Eb_WP()(Index);
