import React, { memo, useState, useEffect } from 'react';
import { Card, Descriptions } from 'antd';

import { TASK_STATUS, TASK_TYPE } from 'constants/types';
import { Eb_WP } from 'components/error-boundary';
import { timeUtils } from "utils/time";

const TaskInfo = (props) => {

  const { taskInfo } = props;

  return <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={'部署详情'}>
    <Descriptions 
      labelStyle={{ width: 100, textAlign: 'right', display: 'block' }}
    >
      <Descriptions.Item label='类型'>{TASK_TYPE[taskInfo.type] || '-'}</Descriptions.Item>
      <Descriptions.Item label='状态'>{TASK_STATUS[taskInfo.status] || '-'}</Descriptions.Item>
      <Descriptions.Item label='分支/标签'>{taskInfo.revision || '-'}</Descriptions.Item>
      <Descriptions.Item label='更新时间'>{timeUtils.format(taskInfo.updatedAt) || '-'}</Descriptions.Item>
      <Descriptions.Item label='执行人'>{taskInfo.creator || '-'}</Descriptions.Item>
    </Descriptions>
  </Card>;
};

export default Eb_WP()(memo(TaskInfo));
