import React, { memo, useState, useEffect } from 'react';
import { Card, Descriptions } from 'antd';

import { ENV_STATUS, AUTO_DESTROY } from 'constants/types';
import { Eb_WP } from 'components/error-boundary';
import { timeUtils } from "utils/time";
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
        return '无限';
      default:
        const it = AUTO_DESTROY.find(d => d.code === ttl) || {};
        return it.name;
    }
  };
  
  return <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={'环境详情'}>
    <Descriptions 
      labelStyle={{ width: 100, textAlign: 'right', display: 'block' }}
    >
      <Descriptions.Item label='状态'>{ENV_STATUS[info.status] || '-'}</Descriptions.Item>
      <Descriptions.Item label='云模板'>{info.templateName || '-'}</Descriptions.Item>
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
