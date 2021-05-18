import React, { useState, useEffect } from "react";
import { Card, List, Space, Divider, notification, Tooltip } from "antd";
import {
  BranchesOutlined,
  UserOutlined,
  GitlabFilled
} from "@ant-design/icons";

import { ctAPI } from "services/base";
import MarkdownParser from "components/coder/markdown-parser";
import RunningTaskItem from "./components/runningTaskItem/index";

const jobInfoItems = {
  num: {
    text: "作业数量",
    getValue: (overviewInfo) => (
      <Space split={<Divider type='vertical' />}>
        <span>plan作业 {overviewInfo.taskPlanCount}</span>
        <span>apply作业 {overviewInfo.taskApplyCount}</span>
      </Space>
    )
  },
  taskAvgPlanTime: {
    text: "平均plan作业时间"
  },
  taskAvgApplyTime: {
    text: "平均apply作业时间"
  },
  planFailedRate: {
    text: "plan作业失败率",
    getValue: (overviewInfo) => {
      const { taskPlanFailedCount, taskPlanCount, taskPlanFailedPercent } =
        overviewInfo;
      return (
        <Space split={<Divider type='vertical' />}>
          <span className='sub-text'>
            {taskPlanFailedCount}/{taskPlanCount}
          </span>
          <span>
            {taskPlanFailedPercent && taskPlanFailedPercent.toFixed(2)}%
          </span>
        </Space>
      );
    }
  },
  applyFailedRate: {
    text: "apply作业失败率",
    getValue: (overviewInfo) => {
      const { taskApplyFailedCount, taskApplyCount, taskApplyFailedPercent } =
        overviewInfo;
      return (
        <Space split={<Divider type='vertical' />}>
          <span className='sub-text'>
            {taskApplyFailedCount}/{taskApplyCount}
          </span>
          <span>{taskApplyFailedPercent}%</span>
        </Space>
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
                  renderItem={(item) => (
                    <RunningTaskItem
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
                  <GitlabFilled style={{ color: "#FCA326" }} />
                </div>
                <Tooltip title={overviewInfo.repoAddr}>
                  <div className='text'>{overviewInfo.repoAddr}</div>
                </Tooltip>
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
              {(overviewInfo.activeCreatorName || []).join("、")}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
