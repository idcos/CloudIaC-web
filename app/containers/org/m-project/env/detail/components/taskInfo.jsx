import React, { memo, useState, useEffect } from 'react';
import { Collapse, Descriptions, Tag, Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import { TASK_STATUS, TASK_STATUS_COLOR, TASK_TYPE } from 'constants/types';
import { Eb_WP } from 'components/error-boundary';
import ChangeInfo from 'components/change-info';
import { timeUtils } from "utils/time";
import styles from '../styles.less';

const TaskInfo = (props) => {

  const { taskInfo = {} } = props;

  return (
    <Collapse expandIconPosition={'right'} forceRender={true}>
      <Collapse.Panel header='作业详情'>
        <Descriptions 
          labelStyle={{ color: '#24292F' }}
          contentStyle={{ color: '#57606A' }}
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
          <Descriptions.Item label='Commit_ID'><span onClick={() => {
            window.open(`${taskInfo.repoAddr.replace('.git', '')}/commit/${taskInfo.commitId}`); 
          }} className={styles.linkToCommit}
          >{taskInfo.commitId && taskInfo.commitId.substring(0, 12) || '-'}</span></Descriptions.Item>
          <Descriptions.Item label='更新时间'>{timeUtils.format(taskInfo.updatedAt) || '-'}</Descriptions.Item>
          <Descriptions.Item label='创建时间'>{timeUtils.format(taskInfo.createdAt) || '-'}</Descriptions.Item>
          <Descriptions.Item label='开始时间'>{timeUtils.format(taskInfo.startAt) || '-'}</Descriptions.Item>
          <Descriptions.Item label='执行时长'>{timeUtils.diff(taskInfo.endAt, taskInfo.startAt) || '-'}</Descriptions.Item>
          <Descriptions.Item label='执行人'>{taskInfo.creator || '-'}</Descriptions.Item>
          <Descriptions.Item label='资源变更'><ChangeInfo {...taskInfo.result} /></Descriptions.Item>
          <Descriptions.Item label='target'>{taskInfo.targets}</Descriptions.Item>
        </Descriptions>
      </Collapse.Panel>
    </Collapse>
  );
};

export default Eb_WP()(memo(TaskInfo));
