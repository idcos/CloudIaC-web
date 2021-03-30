import React, { useState } from 'react';
import { Card, List } from 'antd';
import { Link } from "react-router-dom";

import { BranchesOutlined, UserOutlined } from '@ant-design/icons';

const data = [
  {
    title: 'Ant Design Title 1',
    id: 'org1'
  },
  {
    title: 'Ant Design Title 2',
    id: 'org2'
  },
  {
    title: 'Ant Design Title 3',
    id: 'org3'
  },
  {
    title: 'Ant Design Title 4',
    id: 'org4'
  }
];

const jobInfoItems = {
  num: {
    text: '作业数量'
  },
  averageDuration: {
    text: '平均plan作业时间'
  },
  averageApplyDuration: {
    text: '平均aplly作业时间'
  },
  planFailedRate: {
    text: 'plan作业失败率'
  },
  applyFailedRate: {
    text: 'aplly作业失败率'
  },
  activeMember: {
    text: '活动成员'
  }
};


const Overview = (props) => {
  return <div className='overview'>
    <div className='left'>
      <div className='card'>
        <Card
          title='最新运行'
          extra={<a>全部运行</a>}
        >
          <List
            itemLayout='horizontal'
            dataSource={data}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={<h2>{item.title}</h2>}
                  description='Ant Design, a design language for background applications, is refined by Ant UED Team'
                />
                <div>Content</div>
              </List.Item>
            )}
          />
        </Card>
      </div>
      <div className='card'>
        <Card
          title='README.md'
        />
      </div>
    </div>
    <div className='right'>
      <Card>
        <div className='gitInfo'>
          <p></p>
          <p><BranchesOutlined/></p>
          <p><UserOutlined/></p>
        </div>
        <div className='jobInfo'>
          {Object.keys(jobInfoItems).map(i => <p className='item'>
            <span className='label'>{jobInfoItems[i].text}</span>
            <span className='value'>123</span>
          </p>)}
        </div>
      </Card>
    </div>
  </div>;
};

export default Overview;
