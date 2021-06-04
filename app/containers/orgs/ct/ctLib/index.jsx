import React, { useState, useEffect } from 'react';
import { Button, Space, Table } from "antd";
import moment from 'moment';

import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import { ctAPI } from "services/base";

import CreatCTModal from './components/createCTModal';
import ViewMdModal from './components/viewMdModal';

export default (props) => {

  const { routesParams } = props;

  const [ query, setQuery ] = useState({
    pageSize: 10,
    currentPage: 1
  });
  const [ loading, setLoading ] = useState(false);
  const [ ctLibData, setCtLibData ] = useState([]);
  const [ createCTData, setCreateCTData ] = useState({
    visible: false,
    id: null
  });
  const [ viewMdData, setViewMdData ] = useState({
    visible: false
  });

  useEffect(() => {
    getCTLibList();
  }, [query]);

  const getCTLibList = async () => {
    setLoading(true);
    const res = await ctAPI.ctLibSearch({
      orgId: routesParams.curOrg.id,
      ...query
    });
    setLoading(false);
    if (res.code !== 200) {
      throw new Error(res.message);
    }
    const { list, total } = res.result || {};
    setCtLibData({
      list: list || [],
      total: total || 0
    });
  };

  const columns = [
    {
      title: '云模板名称',
      dataIndex: 'name',
      key: 'name',
      width: 180
    },
    {
      title: '云模板描述',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '仓库地址',
      dataIndex: 'repoAddr',
      key: 'repoAddr',
      ellipsis: true,
      width: 350,
      render: (text) => (
        <a href={text}>{text}</a>
      )
    },
    {
      title: '最后更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      width: 150,
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

  const onChangeTable = (pagination) => {
    const { pageSize, current } = pagination;
    setQuery((preQuery) => ({
      ...preQuery,
      pageSize,
      currentPage: current
    }));
  };

  return (
    <Layout
      contentStyle={{ paddingTop: 0 }}
      extraHeader={
        <PageHeader
          title='云模板库'
          breadcrumb={true}
          subDes={
            <Button onClick={() => getCTLibList()}>刷新云模板库</Button>
          }
        />
      }
    >
      <div className='container-inner-width'>
        <div className='fn-h-20'></div>
        <Table 
          dataSource={ctLibData.list} 
          columns={columns} 
          loading={loading}
          onChange={onChangeTable}
          pagination={{
            current: query.currentPage,
            pageSize: query.pageSize,
            total: ctLibData.total,
            showSizeChanger: true,
            showTotal: (total) => `共${total}条`
          }} 
        />
      </div>
      
      <CreatCTModal 
        visible={createCTData.visible} 
        orgId={routesParams.curOrg.id}
        id={createCTData.id} 
        onClose={() => setCreateCTData({ visible: false, id: null })} 
      />
      <ViewMdModal visible={viewMdData.visible} onClose={() => setViewMdData({ visible: false })} />
    </Layout>
  );
};
