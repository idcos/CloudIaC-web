import React from "react";
import { Tag, Divider, List, Space } from "antd";
import moment from 'moment';

import { CT } from 'constants/types';
import { statusTextCls } from 'utils/util';

export default ({ item, linkToRunningDetail }) => {
  return (
    <List.Item className='running-task-item'>
      <List.Item.Meta
        title={
          <div className='running-task-item-title-wrapper'>
            <div className='running-task-item-title' onClick={() => {
              linkToRunningDetail(item.id); 
            }}
            >
              <div className='idcos-text-ellipsis' title={item.name}>{item.name || '快速执行作业'}</div>
            </div>
            <Tag>{CT.taskType[item.taskType]}</Tag>
          </div>
        }
        description={
          <Space split={<Divider type='vertical' />}>
            { item.guid ? <span>{item.guid}</span> : null }
            { item.creatorName ? <span>{item.creatorName}</span> : null }
            { item.ctServiceId ? <span>{item.ctServiceId}</span> : null }
            { item.repoBranch ? <span>{item.repoBranch}</span> : null }
            { item.commitId ? <span>{item.commitId.slice(0, 8)}</span> : null }
            <span>
              <span className='code-number code-number-add'>+{item.add}</span>
              <span className='code-number code-number-change'>~{item.change}</span>
              <span className='code-number code-number-destroy'>-{item.destroy}</span>
            </span>
          </Space>
        }
      />
      <div className='list-content'>
        <span className={`status-text ${statusTextCls(item.status).cls}`}>
          {CT.taskStatusIcon[item.status]} {CT.taskStatus[item.status]}
        </span>
        <p>{moment(item.endAt).fromNow()}</p>
      </div>
    </List.Item>
  );
};
