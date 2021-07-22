import React, { memo, useState, useEffect, useRef } from 'react';
import { Card, Descriptions, notification } from 'antd';

import { ENV_STATUS } from 'constants/types';
import { Eb_WP } from 'components/error-boundary';
import { timeUtils } from "utils/time";
import { END_ENV_STATUS_LIST } from "constants/types";
import { envAPI } from 'services/base';
import moment from 'moment';

const Index = (props) => {

  const { info } = props;

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
    if (ttl == '0') {
      return '不限';
    }
    return timeUtils.diff(autoDestroyAt, now);
  };
  
  return <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={'环境详情'}>
    <Descriptions 
      labelStyle={{ width: 100, textAlign: 'right', display: 'block' }}
    >
      <Descriptions.Item label='状态'>{ENV_STATUS[info.status] || '-'}</Descriptions.Item>
      <Descriptions.Item label='云模版'>{info.templateName || '-'}</Descriptions.Item>
      <Descriptions.Item label='分支'>{info.revision || '-'}</Descriptions.Item>
      <Descriptions.Item label='资源数'>{info.resourceCount || '-'}</Descriptions.Item>
      <Descriptions.Item label='存活时间'>{formatTTL(info)}</Descriptions.Item>
      <Descriptions.Item label='密钥'>{info.keyName || '-'}</Descriptions.Item>
      <Descriptions.Item label='更新时间'>{timeUtils.format(info.updatedAt) || '-'}</Descriptions.Item>
      <Descriptions.Item label='执行人'>{info.creator || '-'}</Descriptions.Item>
    </Descriptions>
  </Card>;
};

export default Eb_WP()(memo(Index));
