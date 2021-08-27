import React, { useState, useEffect } from 'react';
import { Button, Table, Radio, Input, notification, Divider, Menu } from 'antd';
import history from 'utils/history';
import moment from 'moment';
import { connect } from "react-redux";
import BindPolicyModal from './component/bindPolicyModal';

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
    [ policyView, setPolicyView ] = useState(false),
    [ query, setQuery ] = useState({
      pageNo: 1,
      pageSize: 10
    });
  const bindPolicy = () => {
    setPolicyView(true);
  };
  const columns = [
    {
      dataIndex: 'name',
      title: '环境名称'
    },
    {
      dataIndex: 'description',
      title: '云模板名称'
    },
    {
      dataIndex: 'repoAddr',
      title: '绑定策略组',
      render: (text) => <a onClick={() => bindPolicy()}>{text}</a>
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
      title: '状态'
    },
    {
      title: '操作',
      width: 90,
      render: (record) => {
        return PROJECT_OPERATOR ? (
          <span className='inlineOp'>
            <a 
              type='link' 
              onClick={() => openCheck(record)}
            >检测</a>
            <Divider type={'vertical'}/>
            <a 
              type='link' 
              onClick={() => {
                history.push(`/compliance/compliance-config/env/env-detail`); 
              }}
            >详情</a>
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
      title='环境'
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
    <BindPolicyModal visible={policyView} />
  </Layout>;
};

export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS()
  };
})(Eb_WP()(CTList));
