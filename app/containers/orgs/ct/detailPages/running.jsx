import React, { useState } from 'react';

import { Card, List, Radio } from 'antd';

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


const Running = (props) => {
  const [ status, setStatus ] = useState('running');
  return <div className='running'>
    <Radio.Group
      onChange={e => setStatus(e.target.value)}
      value={status}
    >
      <Radio.Button value='running'>当前运行</Radio.Button>
      <Radio.Button value='all'>全部运行</Radio.Button>
    </Radio.Group>
    <div className='runningList'>
      <Card>
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
  </div>;
};

export default Running;
