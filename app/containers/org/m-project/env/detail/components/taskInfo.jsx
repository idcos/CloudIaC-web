import React, { memo, useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';

import { TASK_STATUS, TASK_STATUS_COLOR, TASK_TYPE } from 'constants/types';
import { Eb_WP } from 'components/error-boundary';
import ChangeInfo from 'components/change-info';
import { timeUtils } from "utils/time";

const TaskInfo = (props) => {

  const { taskInfo = {} } = props;

  return <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={'作业详情'}>
    <Descriptions 
      labelStyle={{ width: 100, textAlign: 'right', display: 'block' }}
    >
      <Descriptions.Item label='状态'>
        {
          TASK_STATUS[taskInfo.status] ? (
            <Tag color={TASK_STATUS_COLOR[taskInfo.status] || 'default'}>{TASK_STATUS[taskInfo.status]}</Tag>
          ) : '-'
        }
        {
          taskInfo.status === 'failed' && taskInfo.message ? (
            <Tooltip title={taskInfo.message}>
              <InfoCircleFilled style={{ color: '#ff4d4f' }} />
            </Tooltip>
          ) : null
        }
      </Descriptions.Item>
      <Descriptions.Item label='类型'>{TASK_TYPE[taskInfo.type] || '-'}</Descriptions.Item>
      <Descriptions.Item label='分支/标签'>{taskInfo.revision || '-'}</Descriptions.Item>
      <Descriptions.Item label='更新时间'>{timeUtils.format(taskInfo.updatedAt) || '-'}</Descriptions.Item>
      <Descriptions.Item label='创建时间'>{timeUtils.format(taskInfo.createdAt) || '-'}</Descriptions.Item>
      <Descriptions.Item label='开始时间'>{timeUtils.format(taskInfo.startAt) || '-'}</Descriptions.Item>
      <Descriptions.Item label='执行时长'>{timeUtils.diff(taskInfo.endAt, taskInfo.startAt) || '-'}</Descriptions.Item>
      <Descriptions.Item label='执行人'>{taskInfo.creator || '-'}</Descriptions.Item>
      <Descriptions.Item label='资源变更'><ChangeInfo {...taskInfo.result} /></Descriptions.Item>
    </Descriptions>
  </Card>;
};

export default Eb_WP()(memo(TaskInfo));
