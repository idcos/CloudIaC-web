import React, { useState, useEffect } from "react";
import moment from 'moment';
import { Card, List, Space, Divider, notification, Tooltip } from "antd";
import {
  BranchesOutlined,
  UserOutlined,
  GitlabOutlined
} from "@ant-design/icons";

import { ctAPI } from "services/base";
import { timeUtils } from 'utils/time';

import MarkdownParser from "components/coder/markdown-parser";
import RunningTaskItem from "./components/runningTaskItem/index";

const jobInfoItems = {
  num: {
    text: "作业数量",
    getValue: (overviewInfo) => (
      <Space split={<Divider type='vertical' />}>
        <span>plan&nbsp;{overviewInfo.taskPlanCount}</span>
        <span>apply&nbsp;{overviewInfo.taskApplyCount}</span>
      </Space>
    )
  },
  taskAvgPlanTime: {
    text: "plan平均时间",
    getValue: (overviewInfo) => {
      const { taskAvgPlanTime } = overviewInfo;
      return timeUtils.humanize(taskAvgPlanTime);
    }
  },
  planFailedRate: {
    text: "plan失败率",
    getValue: (overviewInfo) => {
      const { taskPlanFailedPercent } = overviewInfo;
      return (
        <span>
          {taskPlanFailedPercent && taskPlanFailedPercent.toFixed(2)}%
        </span>
      );
    }
  },
  taskAvgApplyTime: {
    text: "apply平均时间",
    getValue: (overviewInfo) => {
      const { taskAvgApplyTime } = overviewInfo;
      return timeUtils.humanize(taskAvgApplyTime);
    }
  },
  applyFailedRate: {
    text: "apply失败率",
    getValue: (overviewInfo) => {
      const { taskApplyFailedPercent } = overviewInfo;
      return (
        <span>{taskApplyFailedPercent && taskApplyFailedPercent.toFixed(2)}%</span>
      );
    }
  }
};

const Overview = ({
  routesParams: { curOrg, detailInfo, ctRunnerList, ctId, linkToRunningDetail }
}) => {
  const { repoId, repoBranch } = detailInfo;
  const [ overviewInfo, setOverviewInfo ] = useState({});
  const [ codeStr, setCodeStr ] = useState("");

  useEffect(() => {
    featchOverviewInfo();
  }, []);

  useEffect(() => {
    if (repoId) {
      fetchReadme();
    }
  }, [repoId]);

  const featchOverviewInfo = async () => {
    try {
      const res = await ctAPI.overview({
        id: ctId,
        orgId: curOrg.id
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setOverviewInfo(res.result || {});
    } catch (e) {
      notification.error({
        message: e.message
      });
    }
  };

  const fetchReadme = async () => {
    try {
      const res = await ctAPI.repoReadme({
        repoId,
        branch: repoBranch,
        orgId: curOrg.id,
        vcsId: detailInfo.vcsId
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      const { content = "" } = res.result || {};
      setCodeStr(content);
    } catch (e) {
      notification.error({
        message: e.message
      });
    }
  };

  return (
    <div className='overview'>
      <div className='left'>
        <div className='List'>
          <div className='card'>
            <Card title='最新运行'>
              <div className='tableRender'>
                <List
                  itemLayout='horizontal'
                  dataSource={overviewInfo.task || []}
                  renderItem={(item, index) => (
                    <RunningTaskItem
                      index={index}
                      item={item}
                      linkToRunningDetail={linkToRunningDetail}
                      ctRunnerList={ctRunnerList}
                      showCtRunner={false}
                    />
                  )}
                />
              </div>
            </Card>
          </div>
        </div>
        <div className='card'>
          <Card title='README.md'>
            <MarkdownParser value={codeStr} />
          </Card>
        </div>
      </div>
      <div className='right'>
        <Card>
          <div className='info-item'>
            <div className='item-title'>关于</div>
            <div className='item-content-list'>
              <div
                className='item-content-flex idcos-text-ellipsis'
                title={overviewInfo.repoAddr}
              >
                <div className='icon'>
                  <GitlabOutlined />
                </div>
                <div className='text'>
                  <a href={overviewInfo.repoAddr} target='_blank'>{overviewInfo.repoAddr}</a> 
                </div>
              </div>
              <div className='item-content-flex'>
                <div className='icon'>
                  <BranchesOutlined />
                </div>
                <div className='text'>{overviewInfo.repoBranch}</div>
              </div>
              <div className='item-content-flex'>
                <div className='icon'>
                  <UserOutlined />
                </div>
                <div className='text'>{overviewInfo.creatorName}</div>
              </div>
            </div>
          </div>
          <Divider plain={true}></Divider>
          <div className='info-item'>
            <div className='item-title'>活动记录</div>
            <div className='item-content-list'>
              {Object.keys(jobInfoItems).map((i) => (
                <div className='item-content'>
                  <span className='label'>{jobInfoItems[i].text}</span>
                  <span className='value'>
                    {jobInfoItems[i].getValue
                      ? jobInfoItems[i].getValue(overviewInfo)
                      : overviewInfo[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Divider plain={true}></Divider>
          <div className='info-item'>
            <div className='item-title'>活跃成员</div>
            <div className='item-content-wrapper'>
              {
                (overviewInfo.activeCreatorName || []).length > 5 ? 
                  (overviewInfo.activeCreatorName || []).slice(0, 5).join("、") + '等' :
                  (overviewInfo.activeCreatorName || []).join("、")
              }
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
