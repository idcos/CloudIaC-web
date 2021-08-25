import React, { memo, useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';

import { ENV_STATUS, AUTO_DESTROY, ENV_STATUS_COLOR } from 'constants/types';
import { Eb_WP } from 'components/error-boundary';
import { timeUtils } from "utils/time";
import moment from 'moment';
import styles from '../styles.less';

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
  
  return <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={'合规状态'}>
    
  </Card>;
};

export default Eb_WP()(memo(Index));
