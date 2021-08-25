import React, { useState, useEffect } from 'react';
import { Button, Table, Radio, Input, notification, Divider, Menu } from 'antd';
import history from 'utils/history';
import moment from 'moment';
import { connect } from "react-redux";

import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import tplAPI from 'services/tpl';
import getPermission from "utils/permission";

const CTList = ({ userInfo, match = {} }) => {
  const { PROJECT_OPERATOR } = getPermission(userInfo);
  const { projectId } = match.params || {};
  const orgId = 'org-c4i8s1rn6m81fm687b0g';
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
      title: '绑定策略组'
    },
    {
      dataIndex: 'repoAddr',
      title: '仓库地址',
      render: (text) => <a href={text} target='_blank'>{text}</a>
    },
    {
      dataIndex: 'activeEnvironment',
      title: '是否开启检测'
    },
    {
      dataIndex: 'creator',
      title: '状态'
    },
    {
      title: '操作',
      width: 60,
      render: (record) => {
        return PROJECT_OPERATOR ? (
          <span className='inlineOp'>
            <a 
              type='link' 
              onClick={() => openCheck(record)}
            >检测</a>
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

export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS()
  };
})(Eb_WP()(CTList));
