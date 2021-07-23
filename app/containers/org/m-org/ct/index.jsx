import React, { useState, useEffect } from 'react';
import { Button, Table, Radio, Input, notification, Divider, Menu } from 'antd';
import history from 'utils/history';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import tplAPI from 'services/tpl';

const CTList = ({ match = {} }) => {
  const { orgId } = match.params || {};
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
      title: '仓库',
      render: (text) => <a href={text} target='_blank'>{text}</a>
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
      width: 90,
      render: (record) => {
        return (
          <span className='inlineOp'>
            <a type='link' onClick={() => updateCT(record.id)}>编辑</a>
            <Divider type='vertical' />
            <a type='link' onClick={() => onDel(record.id)}>删除</a>
          </span>
        );
      }
    }
  ];

  const createCT = () => {
    history.push(`/org/${orgId}/m-org-ct/createCT`);
  };

  const updateCT = (tplId) => {
    history.push(`/org/${orgId}/m-org-ct/updateCT/${tplId}`);
  };

  const onDel = async (tplId) => {
    try {
      setLoading(true);
      const res = await tplAPI.del({
        tplId,
        orgId
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setLoading(false);
      notification.success({
        message: '删除成功'
      });
      fetchList();
    } catch (e) {
      setLoading(false);
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
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
        orgId
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
        <div style={{ marginBottom: 20 }}>
          <Button 
            type='primary'
            onClick={createCT}
          >新建云模板</Button>
        </div>
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
