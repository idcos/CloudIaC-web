import React from 'react';
import { Card, List, Button } from 'antd';


const data = [
  {
    title: 'Ant Design Title 1',
    id: 'org1'
  }
];

const State = (props) => {
  return <div className='state'>
    <Card>
      <List
        itemLayout='horizontal'
        dataSource={data}
        renderItem={item => (
          <List.Item
            actions={[<Button>下载</Button>]}
          >
            <List.Item.Meta
              title={<h2>{item.title}</h2>}
              description='Ant Design, a design language for background applications, is refined by Ant UED Team'
            />
            <div>Content</div>
          </List.Item>
        )}
      />
    </Card>
    <Card style={{ marginTop: 16 }}>

    </Card>
  </div>;
};

export default State;
