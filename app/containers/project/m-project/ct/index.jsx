/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Table, Space, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import history from 'utils/history';
import moment from 'moment';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import EllipsisText from 'components/EllipsisText';
import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import tplAPI from 'services/tpl';
import getPermission from 'utils/permission';
import { t } from 'utils/i18n';
import { useLoopPolicyStatus } from 'utils/hooks';
import PolicyStatus from 'components/policy-status';
import DetectionDrawer from 'containers/org/m-org/ct/components/detection-drawer';

const CTList = ({ userInfo, match = {}, location }) => {
  const { name } = queryString.parse(location.search);
  const { check, loopRequesting } = useLoopPolicyStatus();
  const { PROJECT_OPERATOR, SYS_OPERATOR, ORG_SET, PROJECT_SET } =
    getPermission(userInfo);
  const { orgId, projectId } = match.params || {};
  const [query, setQuery] = useState({
    pageNo: 1,
    pageSize: 10,
    q: name,
  });
  const [detectionDrawerProps, setDetectionDrawerProps] = useState({
    visible: false,
    id: null,
  });

  useEffect(() => {
    fetchList();
  }, [query]);

  // 列表查询
  const {
    data: resultMap = {
      list: [],
      total: 0,
    },
    run: fetchList,
    loading,
  } = useRequest(
    () =>
      requestWrapper(
        tplAPI.list.bind(null, {
          currentPage: query.pageNo,
          pageSize: query.pageSize,
          q: query.q,
          orgId,
          projectId,
        }),
      ),
    {
      manual: true,
      formatResult: data => ({
        list: data.list || [],
        total: data.total || 0,
      }),
      onSuccess: data => {
        check({
          list: data.list,
          loopFn: () => fetchList(),
        });
      },
    },
  );

  const openDetectionDrawer = ({ id }) => {
    setDetectionDrawerProps({
      id,
      visible: true,
    });
  };

  // 关闭检测详情刷新下列表的检测状态字段
  const closeDetectionDrawer = () => {
    setDetectionDrawerProps({
      id: null,
      visible: false,
    });
  };

  const columns = [
    {
      dataIndex: 'name',
      title: t('define.name'),
      width: 180,
      ellipsis: true,
    },
    {
      dataIndex: 'description',
      title: t('define.des'),
      width: 180,
      ellipsis: true,
    },
    {
      dataIndex: 'relationEnvironment',
      title: t('define.relationEnvironment'),
      width: 78,
      ellipsis: true,
      render: (text, record) => (
        <a
          onClick={() =>
            history.push({
              pathname: `/org/${orgId}/project/${projectId}/m-project-env`,
              search: `?q=${record.name}`,
            })
          }
        >
          {text}
        </a>
      ),
    },
    {
      dataIndex: 'repoAddr',
      title: t('define.repo'),
      width: 249,
      ellipsis: true,
      render: text => (
        <a href={text} target='_blank' rel='noreferrer'>
          <EllipsisText>{text}</EllipsisText>
        </a>
      ),
    },
    {
      dataIndex: 'policyStatus',
      title: t('policy.detection.complianceStatus'),
      width: 110,
      ellipsis: true,
      render: (policyStatus, record) => {
        const clickProps = {
          style: { cursor: 'pointer' },
          onClick: () => openDetectionDrawer(record),
        };
        return (
          <PolicyStatus
            policyStatus={policyStatus}
            clickProps={clickProps}
            empty='-'
          />
        );
      },
    },
    {
      dataIndex: 'creator',
      title: t('define.creator'),
      width: 70,
      ellipsis: true,
    },
    {
      dataIndex: 'createdAt',
      title: t('define.createdAt'),
      width: 152,
      ellipsis: true,
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: t('define.action'),
      width: 100,
      ellipsis: true,
      fixed: 'right',
      render: record => {
        return PROJECT_OPERATOR ? (
          <span className='inlineOp'>
            <a type='link' onClick={() => deployEnv(record.id)}>
              {t('define.deploy')}
            </a>
          </span>
        ) : null;
      },
    },
  ];

  const deployEnv = tplId => {
    history.push(
      `/org/${orgId}/project/${projectId}/m-project-env/deploy/${tplId}`,
    );
  };

  const changeQuery = payload => {
    setQuery({
      ...query,
      ...payload,
    });
  };

  return (
    <Layout
      extraHeader={
        <PageHeader
          title={t('define.scope.template')}
          breadcrumb={true}
          subDes={
            (SYS_OPERATOR || ORG_SET || PROJECT_SET) && (
              <Button
                onClick={() => {
                  history.push(
                    `/org/${orgId}/m-org-ct/createCT?related_project=${projectId}`,
                  );
                }}
                type='primary'
              >
                {t('define.addTemplate')}
              </Button>
            )
          }
        />
      }
    >
      <div className='idcos-card'>
        <div>
          <Space
            style={{
              marginBottom: 20,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div></div>
            <Space>
              <Input
                defaultValue={query.q}
                style={{ width: 320 }}
                allowClear={true}
                placeholder={t('define.ct.search.placeholder')}
                prefix={<SearchOutlined />}
                onPressEnter={e => {
                  const q = e.target.value;
                  changeQuery({ q });
                }}
              />
            </Space>
          </Space>
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
              showTotal: total =>
                t('define.pagination.showTotal', { values: { total } }),
              onChange: (pageNo, pageSize) => {
                changeQuery({
                  pageNo,
                  pageSize,
                });
              },
            }}
          />
          {detectionDrawerProps.visible && (
            <DetectionDrawer
              {...detectionDrawerProps}
              onClose={closeDetectionDrawer}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default connect(state => {
  return {
    userInfo: state.global.get('userInfo').toJS(),
  };
})(Eb_WP()(CTList));
