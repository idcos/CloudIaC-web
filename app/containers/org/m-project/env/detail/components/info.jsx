import React, { useState, useEffect, memo } from 'react';
import { Card, Space, Radio, Input, notification, Descriptions, Menu } from 'antd';
import moment from 'moment';
import { ENV_STATUS } from 'constants/types';
import { Eb_WP } from 'components/error-boundary';
import { AUTO_DESTROY } from 'constants/types';

import { pjtAPI, envAPI } from 'services/base';
const Index = (props) => {
  const { info = {} } = props;
  const getTTL = () => {
    let str = '-';
    if (!!info.autoDestroyAt) {
      str = moment(info.autoDestroyAt).format('YYYY-MM-DD HH:mm');
    } else if ((info.ttl === '' || info.ttl === null) && !info.autoDestroyAt) {
      str = ((AUTO_DESTROY.filter(d => d.code === info.ttl)[0] || {}).name);
    } else if (!info.autoDestroyAt) {
      str = '无限';
    }
    return str;
  };
  return <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={'设置'}>
    <Descriptions 
      labelStyle={{ width: 100, textAlign: 'right', display: 'block' }}
    >
      <Descriptions.Item label='状态'>{ENV_STATUS[info.status] || '-'}</Descriptions.Item>
      <Descriptions.Item label='云模版'>{info.templateName || '-'}</Descriptions.Item>
      <Descriptions.Item label='分支'>{info.revision || '-'}</Descriptions.Item>
      {/* <Descriptions.Item label='Commit_ID'>empty</Descriptions.Item> */}
      <Descriptions.Item label='资源数'>{info.resourceCount || '-'}</Descriptions.Item>
      <Descriptions.Item label='TTL'>{getTTL()}</Descriptions.Item>
      <Descriptions.Item label='密钥'>{info.keyName || '-'}</Descriptions.Item>
      <Descriptions.Item label='更新时间'>{info.updatedAt || '-'}</Descriptions.Item>
      <Descriptions.Item label='执行人'>{info.creator || '-'}</Descriptions.Item>
    </Descriptions>
  </Card>;
};

export default Eb_WP()(memo(Index));
