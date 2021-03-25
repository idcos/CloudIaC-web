import React from 'react';


import { Table } from 'antd';

const columns = [
  { dataIndex: '1', title: '组织名称' },
  { dataIndex: '2', title: '状态' },
  { dataIndex: '3', title: '组织概要' },
  { dataIndex: '4', title: '加入时间' },
  { dataIndex: '5', title: '操作' }
];

const Orgs = () => {
  return <>
    <Table
      columns={columns}
    />
  </>;
};

export default Orgs;
