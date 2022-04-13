import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import history from 'utils/history';
import moment from 'moment';
import { connect } from "react-redux";
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import EllipsisText from 'components/EllipsisText';
import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import tplAPI from 'services/tpl';
import getPermission from "utils/permission";
import { t } from 'utils/i18n';
import { useLoopPolicyStatus } from 'utils/hooks';
import PolicyStatus from 'components/policy-status';
import DetectionDrawer from '../../m-org/ct/components/detection-drawer';

const CTList = ({ userInfo, match = {} }) => {

  const { check, loopRequesting } = useLoopPolicyStatus();
  const { PROJECT_OPERATOR } = getPermission(userInfo);
  const { orgId, projectId } = match.params || {};
  const [ query, setQuery ] = useState({
    pageNo: 1,
    pageSize: 10
  });
  const [ detectionDrawerProps, setDetectionDrawerProps ] = useState({
    visible: false,
    id: null
  });

  useEffect(() => {
    fetchList();
  }, [query]);

  // 列表查询
  const {
    data: resultMap = {
      list: [],
      total: 0
    },
    run: fetchList,
    loading
  } = useRequest(
    () => requestWrapper(
      tplAPI.list.bind(null, { 
        currentPage: query.pageNo,
        pageSize: query.pageSize,
        orgId,
        projectId
      })
    ), {
      manual: true,
      formatResult: (data) => ({
        list: data.list || [],
        total: data.total || 0
      }),
      onSuccess: (data) => {
        check({ 
          list: data.list,
          loopFn: () => fetchList()
        });
      }
    }
  );

  const openDetectionDrawer = ({ id }) => {
    setDetectionDrawerProps({
      id,
      visible: true
    });
  };

  // 关闭检测详情刷新下列表的检测状态字段
  const closeDetectionDrawer = () => {
    setDetectionDrawerProps({
      id: null,
      visible: false
    });
  };

  const columns = [
    {
      dataIndex: 'name',
      title: '云模板名称',
      width: 180,
      ellipsis: true
    },
    {
      dataIndex: 'description',
      title: '云模板描述',
      width: 180,
      ellipsis: true
    },
    {
      dataIndex: 'relationEnvironment',
      title: '关联环境',
      width: 78,
      ellipsis: true,
      render: (text, record) => (
        <a 
          onClick={() => history.push({
            pathname: `/org/${orgId}/project/${projectId}/m-project-env`,
            state: {
              tplName: record.name
            }
          })}
        >{text}</a>
      )
    },
    {
      dataIndex: 'repoAddr',
      title: '仓库',
      width: 249,
      ellipsis: true,
      render: (text) => (
        <a href={text} target='_blank'><EllipsisText>{text}</EllipsisText></a>
      )
    },
    {
      dataIndex: 'policyStatus',
      title: '合规状态',
      width: 110,
      ellipsis: true,
      render: (policyStatus, record) => {
        const clickProps = {
          style: { cursor: 'pointer' },
          onClick: () => openDetectionDrawer(record)
        };
        return <PolicyStatus policyStatus={policyStatus} clickProps={clickProps} empty='-' />;
      }
    },
    {
      dataIndex: 'creator',
      title: '创建人',
      width: 70,
      ellipsis: true
    },
    {
      dataIndex: 'createdAt',
      title: '创建时间',
      width: 152,
      ellipsis: true,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: t('define.action'),
      width: 100,
      ellipsis: true,
      fixed: 'right',
      render: (record) => {
        return PROJECT_OPERATOR ? (
          <span className='inlineOp'>
            <a 
              type='link' 
              onClick={() => deployEnv(record.id)}
            >部署</a>
          </span>
        ) : null;
      }
    }
  ];

  const deployEnv = (tplId) => {
    history.push(`/org/${orgId}/project/${projectId}/m-project-env/deploy/${tplId}`);
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
          loading={loading && !loopRequesting}
          scroll={{ x: 'min-content' }}
          pagination={{
            current: query.pageNo,
            pageSize: query.pageSize,
            total: resultMap.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => t('define.pagination.showTotal', { values: { total } }),
            onChange: (pageNo, pageSize) => {
              changeQuery({
                pageNo,
                pageSize
              });
            }
          }}
        />
        {detectionDrawerProps.visible && <DetectionDrawer 
          {...detectionDrawerProps}
          onClose={closeDetectionDrawer}
        />} 
      </div>
    </div>
  </Layout>;
};

export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS()
  };
})(Eb_WP()(CTList));
