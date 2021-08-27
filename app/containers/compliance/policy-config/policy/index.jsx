import React, { useState, useEffect } from 'react';
import { Button, Table, Space, Input, notification, Divider, Menu } from 'antd';
import history from 'utils/history';
import moment from 'moment';
import { connect } from "react-redux";

import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import tplAPI from 'services/tpl';
import getPermission from "utils/permission";
import Detection from './detection';

const CTList = ({ userInfo, match = {} }) => {
  const { PROJECT_OPERATOR } = getPermission(userInfo);
  const { projectId } = match.params || {};
  const orgId = 'org-c4i8s1rn6m81fm687b0g';
  const [ loading, setLoading ] = useState(false),
    [ visible, setVisible ] = useState(false),
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
      title: '策略名称'
    },
    {
      dataIndex: 'description',
      title: '标签'
    },
    {
      dataIndex: 'repoAddr',
      title: '策略组'
      // render: (text) => <a href={text} target='_blank'>{text}</a>
    },
    {
      dataIndex: 'activeEnvironment',
      title: '严重性'
    },
    {
      dataIndex: 'activeEnvironment',
      title: '通过'
    },
    {
      dataIndex: 'activeEnvironment',
      title: '不通过'
    },
    {
      dataIndex: 'activeEnvironment',
      title: '屏蔽'
    },
    {
      dataIndex: 'creator',
      title: '创建者'
    },
    {
      dataIndex: 'creator',
      title: '最后更新时间'
    },
    {
      title: '操作',
      width: 130,
      render: (record) => {
        return PROJECT_OPERATOR ? (
          <span className='inlineOp'>
            <a 
              type='link' 
              onClick={() => setVisible(true)}
            >检测</a>
            <Divider type={'vertical'} />
            <a 
              type='link' 
              onClick={() => openCheck(record)}
            >编辑</a>
            <Divider type={'vertical'} />
            <a 
              type='link' 
              onClick={() => openCheck(record)}
            >禁用</a>
          </span>
        ) : null;
      }
    }
  ];

  const openCheck = (record) => {
    return;
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
  console.log(visible, 'visible');
  return <Layout
    extraHeader={<PageHeader
      title='策略'
      breadcrumb={true}
    />}
  >
    <div className='idcos-card'>
      <Space style={{ marginBottom: 12 }}>
        <Button type={'primary'} onClick={() => {
          history.push('/compliance/strategy-config/strategy/strategy-create');
        }}
        >新建策略</Button>
      </Space>
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
    <Detection visible={visible} toggleVisible={() => setVisible(false)} />
  </Layout>;
};

export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS()
  };
})(Eb_WP()(CTList));
