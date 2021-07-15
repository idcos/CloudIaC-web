import React, { useMemo } from "react";
import { Tag, Divider, List, Space, Tooltip } from "antd";
import moment from "moment";

import { CT } from "constants/types";
import { statusTextCls, formatCTRunner } from "utils/util";
import { CommitIdIcon, BranchesIcon } from "components/common/localIcon";

import styles from "./styles.less";

export default ({
  item,
  index,
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
    createdAt
  } = item;
  const ctRunner = formatCTRunner(ctRunnerList, ctServiceId);

  const changeInfo = useMemo(() => {
    let info;
    if (add || change || destroy) {
      info = {
        text: (
          <span>
            <span className='code-number code-number-add'>+{add || 0}</span>
            <span className='code-number code-number-change'>~{change || 0}</span>
            <span className='code-number code-number-destroy'>
              -{destroy || 0}
            </span>
          </span>
        ),
        toolText: (
          <span>
            <span>{add}添加 <br/> </span>
            <span>{change}更新 <br/> </span>
            <span>{destroy}删除 <br/> </span>
          </span>
        )
      };
    }
    return info;
  }, [ add, change, destroy ]);

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
              { index === 0 ? '最新作业' : '历史作业' }
            </div>
            {CT.taskType[taskType] ? <Tag>{CT.taskType[taskType]}</Tag> : null}
          </div>
        }
        description={
          <Space split={<Divider type='vertical' />}>
            {guid ? <span>{guid}</span> : null}
            {creatorName ? <span>{creatorName}</span> : null}
            {ctRunner && showCtRunner ? (
              <Tooltip title={<> ct-runner：{ctRunner} </>}>
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
            {
              changeInfo ? (
                <Tooltip title={changeInfo.toolText} overlayStyle={{ minWidth: 135 }}>
                  {changeInfo.text}
                </Tooltip>
              ) : null
            }
          </Space>
        }
      />
      <div className='list-content'>
        <span className={`status-text ${statusTextCls(status).cls}`}>
          {CT.taskStatusIcon[status]} {CT.taskStatus[status]}
        </span>
        <p className='end-at-time reset-styles'>{moment(createdAt).fromNow()}</p>
      </div>
    </List.Item>
  );
};
