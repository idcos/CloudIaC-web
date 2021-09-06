import React, { useState, useEffect } from 'react';
import { Table, notification, Divider } from 'antd';
import history from 'utils/history';
import { connect } from "react-redux";
import BindPolicyModal from 'components/policy-modal';

import Detection from './component/detection';

import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import cenvAPI from 'services/cenv';
import getPermission from "utils/permission";

const CTList = ({ userInfo, match = {} }) => {

  const { PROJECT_OPERATOR } = getPermission(userInfo);
  const [ loading, setLoading ] = useState(false),
    [ viewDetection, setViewDetection ] = useState(false),
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
      dataIndex: 'templateName',
      title: '云模板名称'
    },
    {
      dataIndex: 'policyGroups',
      title: '绑定策略组',
      render: (text) => <a onClick={() => bindPolicy()}>{text.length > 0 && text || '绑定'}</a>
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
      dataIndex: 'status',
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
              onClick={() => setViewDetection(true)}
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

  useEffect(() => {
    fetchList();
  }, [query]);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await cenvAPI.list({
        currentPage: query.pageNo,
        pageSize: query.pageSize
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
    {policyView && <BindPolicyModal visible={policyView} toggleVisible={() => setPolicyView(false)}/>}
    {viewDetection && <Detection visible={viewDetection} toggleVisible={() => setViewDetection(false)}/>}
  </Layout>;
};

export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS()
  };
})(Eb_WP()(CTList));
