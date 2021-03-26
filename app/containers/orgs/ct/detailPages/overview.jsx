import React, { useState } from 'react';
import { Card, List } from 'antd';
import { Link } from "react-router-dom";

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
      <Card/>
    </div>
  </div>;
};

export default Overview;
