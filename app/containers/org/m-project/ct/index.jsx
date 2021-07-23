import React, { useState, useEffect } from 'react';
import { Button, Table, Radio, Input, notification, Divider, Menu } from 'antd';
import history from 'utils/history';
import moment from 'moment';

import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import tplAPI from 'services/tpl';

const CTList = ({ match = {} }) => {
  const { orgId, projectId } = match.params || {};
  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [],
      total: 0
    }),
    [ query, setQuery ] = useState({
      pageNo: 1,
      pageSize: 10
    });

  const columns = [
    {
      dataIndex: 'name',
      title: '云模板名称'
    },
    {
      dataIndex: 'description',
      title: '云模板描述'
    },
    {
      dataIndex: 'activeEnvironment',
      title: '活跃环境'
    },
    {
      dataIndex: 'repoAddr',
      title: '仓库'
    },
    {
      dataIndex: 'creator',
      title: '创建人'
    },
    {
      dataIndex: 'createdAt',
      title: '创建时间',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      width: 180,
      render: (record) => {
        return (
          <span className='inlineOp'>
            <a 
              type='link' 
              onClick={() => deployEnv(record.id)}
            >部署</a>
          </span>
        );
      }
    }
  ];

  const deployEnv = (tplId) => {
    history.push(`/org/${orgId}/project/${projectId}/m-project-env/deploy/${tplId}`);
  };

  useEffect(() => {
    fetchList();
  }, [query]);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await tplAPI.list({
        currentPage: query.pageNo,
        pageSize: query.pageSize,
        orgId,
        projectId
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setLoading(false);
      setResultMap({
        list: res.result.list || [],
        total: res.result.total || 0
      });
    } catch (e) {
      setLoading(false);
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const changeQuery = (payload) => {
    setQuery({
      ...query,
      ...payload
    });
  };

  return <Layout
    extraHeader={<PageHeader
      title='云模板'
      breadcrumb={true}
    />}
  >
    <div className='idcos-card'>
      <div>
        <Table
          columns={columns}
          dataSource={resultMap.list}
          loading={loading}
          pagination={{
            current: query.pageNo,
            pageSize: query.pageSize,
            total: resultMap.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共${total}条`,
            onChange: (pageNo, pageSize) => {
              changeQuery({
                pageNo,
                pageSize
              });
            }
          }}
        />
      </div>
    </div>
  </Layout>;
};

export default Eb_WP()(CTList);
