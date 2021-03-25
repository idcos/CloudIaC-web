import React, { useState } from 'react';

import { Table } from 'antd';

const columns = [
  { dataIndex: '1', title: 'Token' },
  { dataIndex: '2', title: '状态' },
  { dataIndex: '3', title: '上次使用时间' },
  { dataIndex: '4', title: '创建时间' },
  { dataIndex: '5', title: '操作' }
];

const ApiToken = () => {
  return <>
    <Table
      columns={columns}
    />
  </>;
};

export default ApiToken;
