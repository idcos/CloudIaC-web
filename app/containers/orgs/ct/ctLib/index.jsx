import React, { useState, useEffect } from 'react';
import { Button, Space, Table } from "antd";

import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import { ctAPI } from "services/base";

import CreatCTModal from './components/createCTModal';
import ViewMdModal from './components/viewMdModal';

export default (props) => {

  const { routesParams } = props;

  const [ ctLibList, setCtLibList ] = useState([]);
  const [ createCTData, setCreateCTData ] = useState({
    visible: false,
    id: null
  });
  const [ viewMdData, setViewMdData ] = useState({
    visible: false
  });

  useEffect(() => {
    getCTLibList();
  }, []);

  const getCTLibList = async () => {
    const res = await ctAPI.ctLibSearch({
      orgId: routesParams.curOrg.id
    });
    if (res.code !== 200) {
      throw new Error(res.message);
    }
    setCtLibList(res.result || []);
  };

  const columns = [
    {
      title: '云模板名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '云模板描述',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '仓库地址',
      dataIndex: 'repoAddr',
      key: 'repoAddr'
    },
    {
      title: '最后更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt'
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
