import React from "react";
import { Tag, Divider, List, Space, Tooltip } from "antd";
import moment from "moment";

import { CT } from "constants/types";
import { statusTextCls, formatCTRunner } from "utils/util";
import { CommitIdIcon, BranchesIcon } from "components/common/localIcon";

import styles from "./styles.less";

export default ({
  item,
  linkToRunningDetail,
  ctRunnerList,
  showCtRunner = true
}) => {
  const {
    id,
    name,
    taskType,
    guid,
    creatorName,
    ctServiceId,
    repoBranch,
    commitId,
    add,
    change,
    destroy,
    status,
    endAt
  } = item;
  const ctRunner = formatCTRunner(ctRunnerList, ctServiceId);
  return (
    <List.Item className={styles.runningTaskItem}>
      <List.Item.Meta
        title={
          <div className='running-task-item-title-wrapper'>
            <div
              className='running-task-item-title'
              onClick={() => {
                linkToRunningDetail(id);
              }}
            >
              <div className='idcos-text-ellipsis' title={name}>
                {name || "快速执行作业"}
              </div>
            </div>
            {CT.taskType[taskType] ? <Tag>{CT.taskType[taskType]}</Tag> : null}
          </div>
        }
        description={
          <Space split={<Divider type='vertical' />}>
            {guid ? <span>{guid}</span> : null}
            {creatorName ? <span>{creatorName}</span> : null}
            {ctRunner && showCtRunner ? (
              <Tooltip title={ctRunner}>
                <div className='ct-runner'>
                  {ctRunner}
                </div>
              </Tooltip>
            ) : null}
            {repoBranch ? (
              <span>
                <Tooltip title='分支'>
                  <span><BranchesIcon />{' '}</span>
                </Tooltip>
                {repoBranch}
              </span>
            ) : null}
            {commitId ? (
              <span>
                <Tooltip title='commitid'>
                  <span><CommitIdIcon />{' '}</span>
                </Tooltip>
                {commitId.slice(0, 8)}
              </span>
            ) : null}
            <span>
              <span className='code-number code-number-add'>+{add}</span>
              <span className='code-number code-number-change'>~{change}</span>
              <span className='code-number code-number-destroy'>
                -{destroy}
              </span>
            </span>
          </Space>
        }
      />
      <div className='list-content'>
        <span className={`status-text ${statusTextCls(status).cls}`}>
          {CT.taskStatusIcon[status]} {CT.taskStatus[status]}
        </span>
        <p className='end-at-time'>{moment(endAt).fromNow()}</p>
      </div>
    </List.Item>
  );
};