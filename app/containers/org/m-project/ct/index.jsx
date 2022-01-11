import React, { useState, useEffect } from 'react';
import { Table, notification, Spin } from 'antd';
import history from 'utils/history';
import moment from 'moment';
import { connect } from "react-redux";
import EllipsisText from 'components/EllipsisText';
import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import tplAPI from 'services/tpl';
import getPermission from "utils/permission";
import { useLoopPolicyStatus } from 'utils/hooks';
import { CustomTag } from 'components/custom';
import DetectionDrawer from '../../m-org/ct/components/detection-drawer';

const CTList = ({ userInfo, match = {} }) => {

  const { check } = useLoopPolicyStatus();
  const { PROJECT_OPERATOR } = getPermission(userInfo);
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
  const [ detectionDrawerProps, setDetectionDrawerProps ] = useState({
    visible: false,
    id: null
  });

  useEffect(() => {
    fetchList();
  }, [query]);

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
      width: 100,
      ellipsis: true,
      render: (policyStatus, record) => {
        const clickProps = {
          style: { cursor: 'pointer' },
          onClick: () => openDetectionDrawer(record)
        };
        const map = {
          disable: <CustomTag type='default' text='未开启' />,
          enable: <CustomTag type='default' text='未检测' />,
          pending: <Spin />,
          passed: <CustomTag type='success' text='合规' {...clickProps} />,
          violated: <CustomTag type='error' text='不合规' {...clickProps} />
        };
        return map[policyStatus];
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
      title: '操作',
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
      check({ 
        list: res.result.list || [],
        loopFn: () => fetchList()
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
          scroll={{ x: 'min-content', y: 570 }}
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
