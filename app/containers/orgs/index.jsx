import React, { useEffect } from 'react';
import { List, Tag } from 'antd';
import { Link } from 'react-router-dom';

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';


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

const Orgs = (props) => {
  return <Layout
    extraHeader={<PageHeader
      title='组织'
      breadcrumb={false}
    />}
  >
    <div className='container-inner-width whiteBg withPadding'>
      <List
        itemLayout='horizontal'
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={<Link to={`/${item.id}/ct`}>{item.title}</Link>}
              description='Ant Design, a design language for background applications, is refined by Ant UED Team'
            />
          </List.Item>
        )}
      />
    </div>
  </Layout>;
};


export default Eb_WP()(Orgs);
