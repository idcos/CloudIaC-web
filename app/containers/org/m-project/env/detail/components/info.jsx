import React, { useState, useEffect, memo } from 'react';
import { Card, Space, Radio, Input, notification, Descriptions, Menu } from 'antd';

import { ENV_STATUS } from 'constants/types';
import { Eb_WP } from 'components/error-boundary';
import { AUTO_DESTROY } from 'constants/types';

import { pjtAPI, envAPI } from 'services/base';
const Index = (props) => {
  const { info = {} } = props;

  return <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={'设置'}>
    <Descriptions 
      labelStyle={{ width: 100, textAlign: 'right', display: 'block' }}
    >
      <Descriptions.Item label='状态'>{ENV_STATUS[info.status] || '-'}</Descriptions.Item>
      <Descriptions.Item label='云模版'>{info.templateName || '-'}</Descriptions.Item>
      <Descriptions.Item label='分支'>{info.revision || '-'}</Descriptions.Item>
      {/* <Descriptions.Item label='Commit_ID'>empty</Descriptions.Item> */}
      <Descriptions.Item label='资源数'>{info.resourceCount || '-'}</Descriptions.Item>
      <Descriptions.Item label='TTL'>{(((AUTO_DESTROY.filter(d => d.code === info.ttl)[0] || {}).name)) || (info.ttl == 0 ? '无限' : '-')}</Descriptions.Item>
      <Descriptions.Item label='密钥'>密钥</Descriptions.Item>
      <Descriptions.Item label='更新时间'>{info.updatedAt || '-'}</Descriptions.Item>
      <Descriptions.Item label='执行人'>{info.creator || '-'}</Descriptions.Item>
    </Descriptions>
  </Card>;
};

export default Eb_WP()(memo(Index));
