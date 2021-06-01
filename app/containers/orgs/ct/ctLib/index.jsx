import React, { useState, useEffect } from 'react';
import { Button, Space, Table } from "antd";

import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';

import CreatCTModal from './components/createCTModal';
import ViewMdModal from './components/viewMdModal';

export default (props) => {

  const [ ctLibList, setCtLibList ] = useState([
    {
      id: 1,
      name: '云模板名称',
      des: '云模板描述',
      address: '仓库地址',
      updateTime: '最后更新时间'
    }
  ]);
  const [ createCTData, setCreateCTData ] = useState({
    visible: false,
    id: null
  });
  const [ viewMdData, setViewMdData ] = useState({
    visible: false
  });

  const columns = [
    {
      title: '云模板名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '云模板描述',
      dataIndex: 'des',
      key: 'des'
    },
    {
      title: '仓库地址',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: '最后更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime'
    },
    {
      title: '操作',
      render: (item) => {
        const { id } = item;
        return (
          <Space size='middle'>
            <a onClick={() => setCreateCTData({ visible: true, id })}>创建</a>
            <a onClick={() => setViewMdData({ visible: true })}>查看文档</a>
          </Space>
        );
      }
    }
  ];

  return (
    <Layout
      contentStyle={{ paddingTop: 0 }}
      extraHeader={
        <PageHeader
          title='云模板库'
          breadcrumb={true}
          subDes={
            <Button>刷新云模板库</Button>
          }
        />
      }
    >
      <div className='container-inner-width'>
        <div className='fn-h-20'></div>
        <Table dataSource={ctLibList} columns={columns} />
      </div>
      
      <CreatCTModal visible={createCTData.visible} id={createCTData.id} onClose={() => setCreateCTData({ visible: false, id: null })} />
      <ViewMdModal visible={viewMdData.visible} onClose={() => setViewMdData({ visible: false })} />
    </Layout>
  );
};
