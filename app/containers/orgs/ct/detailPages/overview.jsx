import React, { useState, useEffect } from 'react';
import { Card, List, Space, Divider, notification } from 'antd';

import MarkdownParser from 'components/coder/markdown-parser';

import { ctAPI } from 'services/base';
import { CT } from 'constants/types';
import { timeUtils } from 'utils/time';

import { BranchesOutlined, UserOutlined, GitlabFilled } from '@ant-design/icons';

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
const statusTextCls = (status) => {
  let cls = '';
  switch (status) {
    case 'failed':
      cls = 'danger';
      break;
    case 'pending':
      cls = 'normal';
      break;
    default:
      break;
  }
  return cls;
};

const Overview = ({ curOrg, detailInfo, setTabs }) => {
  const { overviewInfo = {}, repoId, repoBranch } = detailInfo;
  const [ codeStr, setCodeStr ] = useState('');

  useEffect(() => {
    if (repoId) {
      fetchReadme();
    }
  }, [repoId]);

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
            extra={<a onClick={() => setTabs('running')}>全部运行</a>}
          >
            <div className='tableRender'>
              <List
                itemLayout='horizontal'
                dataSource={overviewInfo.task || []}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={<h2>
                        {item.creatorName || '-'} {timeUtils.format(item.createdAt) || '-'} 从 {item.repoBranch} {item.commitId}
                      </h2>}
                      description={
                        <Space split={<Divider type='vertical' />}>
                          <span>{item.guid}</span>
                          <span>{CT.taskType[item.taskType]}</span>
                        </Space>
                      }
                    />
                    <div className='list-content'>
                      <span className={`status-text ${statusTextCls(item.status)}`}>{CT.taskStatusIcon[item.status]} {CT.taskStatus[item.status]}</span>
                      <p>{timeUtils.format(item.endAt)}</p>
                    </div>
                  </List.Item>
                )}
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
          <p className='idcos-text-ellipsis'><GitlabFilled style={{ color: '#FCA326' }}/>{overviewInfo.repoAddr}</p>
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
