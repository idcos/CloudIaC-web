import React, { useState, useEffect } from 'react';
import { Card, List, Space, Divider, notification } from 'antd';
import { BranchesOutlined, UserOutlined, GitlabFilled } from '@ant-design/icons';

import { ctAPI } from 'services/base';
import MarkdownParser from 'components/coder/markdown-parser';
import RunningTaskItem from './components/runningTaskItem';

const jobInfoItems = {
  num: {
    text: '作业数量',
    getValue: (overviewInfo) => <Space split={<Divider type='vertical' />}>
      <span>plan作业 {overviewInfo.taskPlanCount}</span>
      <span>apply作业 {overviewInfo.taskApplyCount}</span>
    </Space>
  },
  taskAvgPlanTime: {
    text: '平均plan作业时间'
  },
  taskAvgApplyTime: {
    text: '平均apply作业时间'
  },
  planFailedRate: {
    text: 'plan作业失败率',
    getValue: (overviewInfo) => {
      const { taskPlanFailedCount, taskPlanCount, taskPlanFailedPercent } = overviewInfo;
      return <Space split={<Divider type='vertical' />}>
        <span>{taskPlanFailedCount}/{taskPlanCount}</span>
        <span>{taskPlanFailedPercent}%</span>
      </Space>;
    }
  },
  applyFailedRate: {
    text: 'apply作业失败率',
    getValue: (overviewInfo) => {
      const { taskApplyFailedCount, taskApplyCount, taskApplyFailedPercent } = overviewInfo;
      return <Space split={<Divider type='vertical'/>}>
        <span>{taskApplyFailedCount}/{taskApplyCount}</span>
        <span>{taskApplyFailedPercent}%</span>
      </Space>;
    }
  },
  activeCreatorName: {
    text: '活动成员',
    getValue: (overviewInfo) => <span>{(overviewInfo.activeCreatorName || []).join('、')}</span>
  }
};

const Overview = ({ routesParams: { curOrg, detailInfo, ctId, changeTab, linkToRunningDetail } }) => {
  const { repoId, repoBranch } = detailInfo;
  const [ overviewInfo, setOverviewInfo ] = useState({});
  const [ codeStr, setCodeStr ] = useState('');

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
        orgId: curOrg.id
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      const { content = '' } = res.result || {};
      setCodeStr(content);
    } catch (e) {
      notification.error({
        message: e.message
      });
    }
  };

  return <div className='overview'>
    <div className='left'>
      <div className='List'>
        <div className='card'>
          <Card
            title='最新运行'
            extra={<a onClick={() => changeTab('running')}>全部运行</a>}
          >
            <div className='tableRender'>
              <List
                itemLayout='horizontal'
                dataSource={overviewInfo.task || []}
                renderItem={item => <RunningTaskItem item={item} linkToRunningDetail={linkToRunningDetail}/>}
              />
            </div>
          </Card>
        </div>
      </div>
      <div className='card'>
        <Card
          title='README.md'
        >
          <MarkdownParser
            value={codeStr}
          />
        </Card>
      </div>
    </div>
    <div className='right'>
      <Card>
        <div className='gitInfo'>
          <p className='idcos-text-ellipsis' title={overviewInfo.repoAddr}><GitlabFilled style={{ color: '#FCA326' }}/>{overviewInfo.repoAddr}</p>
          <p><BranchesOutlined/> {overviewInfo.repoBranch}</p>
          <p><UserOutlined/> {}</p>
        </div>
        <div className='jobInfo'>
          {Object.keys(jobInfoItems).map(i => <p className='item'>
            <span className='label'>{jobInfoItems[i].text}</span>
            <span className='value'>{jobInfoItems[i].getValue ? jobInfoItems[i].getValue(overviewInfo) : overviewInfo[i]}</span>
          </p>)}
        </div>
      </Card>
    </div>
  </div>;
};

export default Overview;
