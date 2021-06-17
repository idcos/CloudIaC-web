import React, { useState, useEffect } from 'react';
import { Button, Space, Table, notification } from "antd";
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
    visible: false
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
      notification.error({
        message: '获取失败',
        description: res.message
      });
      return;
    }
    const { list = [], total = 0 } = res.result || {};
    setCtLibData({
      list,
      total
    });
  };

  const columns = [
    {
      title: '云模板名称',
      dataIndex: 'name',
      key: 'name',
      width: 168
    },
    {
      title: '云模板描述',
      dataIndex: 'description',
      width: 278,
      ellipsis: true,
      key: 'description'
    },
    {
      title: '仓库地址',
      dataIndex: 'repoAddr',
      width: 307,
      key: 'repoAddr',
      ellipsis: true,
      render: (text) => (
        <a href={text} target='_blank'>{text}</a>
      )
    },
    {
      title: '最后更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 132,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      width: 148,
      render: (item) => {
        const { id, repoBranch, repoId } = item;
        return (
          <Space size='middle'>
            <a onClick={() => setCreateCTData({ visible: true, id })}>创建</a>
            <a onClick={() => setViewMdData({ visible: true, repoBranch, repoId })}>查看文档</a>
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
        curOrg={routesParams.curOrg}
        id={createCTData.id} 
        onClose={() => setCreateCTData({ visible: false })} 
      />
      <ViewMdModal 
        visible={viewMdData.visible} 
        repoBranch={viewMdData.repoBranch} 
        repoId={viewMdData.repoId} 
        orgId={routesParams.curOrg.id}
        onClose={() => setViewMdData({ visible: false })} 
      />
    </Layout>
  );
};
