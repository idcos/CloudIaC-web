import React, { useState } from 'react';
import { Badge, Table, Input, Select, Space, Divider, Switch, Button, Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { connect } from "react-redux";
import noop from 'lodash/noop';
import { useRequest } from 'ahooks';
import { useSearchFormAndTable } from 'utils/hooks';
import { requestWrapper } from 'utils/request';
import { Eb_WP } from 'components/error-boundary';
import EllipsisText from 'components/EllipsisText';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import ctplAPI from 'services/ctpl';
import BindPolicyGroupModal from './component/bindPolicyGroupModal';
import DetectionDrawer from './component/detection-drawer';
import { POLICIES_DETECTION, POLICIES_DETECTION_COLOR } from 'constants/types';

const CCTList = ({ orgs }) => {
  const orgOptions = ((orgs || {}).list || []).map(it => ({ label: it.name, value: it.id }));
  const [ bindPolicyGroupModalProps, setBindPolicyGroupModalProps ] = useState({
    visible: false,
    id: null,
    title: '',
    policyGroupIds: [],
    onSuccess: noop
  });
  const [ detectionDrawerProps, setDetectionDrawerProps ] = useState({
    visible: false,
    id: null
  });

  // 启用/禁用云模版扫描
  const {
    run: changeEnabled,
  } = useRequest(
    (params) => requestWrapper(
      ctplAPI.enabled.bind(null, params),
      { autoSuccess: true }
    ), {
      manual: true,
      fetchKey: (params) => params.id,
      onSuccess: () => refreshList()
    }
  );

  // 合规检测
  const {
    run: runScan,
    fetches: scanFetches
  } = useRequest(
    ({ id }) => requestWrapper(
      ctplAPI.runScan.bind(null, { tplId: id })
    ), {
      manual: true,
      fetchKey: (params) => params.id,
      onSuccess: (data, params) => {
        const { id } = params[0] || {};
        openDetectionDrawer({ id });
      }
    }
  );

  // 环境列表查询
  const {
    loading: tableLoading,
    data: tableData,
    run: fetchList,
    refresh: refreshList
  } = useRequest(
    (params) => requestWrapper(
      ctplAPI.list.bind(null, params)
    ), {
      manual: true
    }
  );

  // 表单搜索和table关联hooks
  const { 
    tableProps, 
    onChangeFormParams,
  } = useSearchFormAndTable({
    tableData,
    onSearch: (params) => {
      const { current: currentPage, ...restParams } = params;
      fetchList({ currentPage, ...restParams });
    }
  });

  const changeOrg = (orgId) => {
    onChangeFormParams({ orgId, projectId: undefined });
  };

  const openDetectionDrawer = ({ id }) => {
    setDetectionDrawerProps({
      id,
      visible: true
    });
  };

  // 关闭检测详情刷新下列表的检测状态字段
  const closeDetectionDrawer = () => {
    refreshList();
    setDetectionDrawerProps({
      id: null,
      visible: false
    });
  };

  const openBindPolicyGroupModal = ({ id, policyGroups, title }, onSuccess = refreshList) => {
    setBindPolicyGroupModalProps({
      visible: true,
      policyGroupIds: (policyGroups || []).map((it) => it.id),
      id,
      title,
      onSuccess
    });
  };

  const closeBindPolicyGroupModal = () => {
    setBindPolicyGroupModalProps({
      visible: false,
      policyGroupIds: [],
      id: null,
      title: '',
      onSuccess: noop
    })
  };

  // 开启/关闭合规检测
  const switchEnabled = ({ enabled, id, policyGroups, name }) => {
    if (enabled) {
      openBindPolicyGroupModal({ id, policyGroups, title: '开启合规检测' }, () => {
        changeEnabled({ id, enabled: true }); // changeEnabled成功会触发列表刷新，无需重复刷新列表
      });
    } else {
      Modal.confirm({
        width: 480,
        title: `确认操作`,
        content: `你确定要关闭${name}的合规检测吗？`,
        icon: <ExclamationCircleFilled />,
        okText: '确认',
        cancelText: '取消',
        onOk: () => changeEnabled({ id, enabled: false })
      });
    }
  };

  const columns = [
    {
      dataIndex: 'name',
      title: '云模板名称',
      width: 175,
      ellipsis: true,
      render: (text) => <EllipsisText>{text}</EllipsisText>
    },
    {
      dataIndex: 'policyGroups',
      title: '绑定策略组',
      width: 200,
      ellipsis: true,
      render: (policyGroups, record) => {
        return policyGroups.length > 0 ? (
          <a onClick={() => openBindPolicyGroupModal({ ...record, title: '绑定策略组' })}>
            <EllipsisText>{policyGroups.map(it => it.name).join('、')}</EllipsisText>
          </a>
        ) : '-'; 
      }
    },
    {
      dataIndex: 'orgName',
      title: '组织名称',
      width: 160,
      ellipsis: true,
      render: (text) => <EllipsisText>{text}</EllipsisText>
    },
    {
      dataIndex: 'passed',
      title: '通过',
      width: 64,
      ellipsis: true
    },
    {
      dataIndex: 'violated',
      title: '不通过',
      width: 68,
      ellipsis: true
    },
    {
      dataIndex: 'suppressed',
      title: '屏蔽',
      width: 61,
      ellipsis: true
    },
    {
      dataIndex: 'failed',
      title: '失败',
      width: 72,
      ellipsis: true
    },
    {
      dataIndex: 'policyStatus',
      title: '状态',
      width: 94,
      ellipsis: true,
      render: (text) => text ? <Badge color={POLICIES_DETECTION_COLOR[text]} text={POLICIES_DETECTION[text]} /> : '-'
    },
    {
      dataIndex: 'enabled',
      title: '开启检测',
      width: 88,
      ellipsis: true,
      fixed: 'right',
      render: (enabled, record) => {
        const { id, name, policyGroups } = record;
        return (
          <Switch 
            checked={enabled} 
            size='small' 
            onChange={(checked) => switchEnabled({ enabled: checked, id, policyGroups, name })} 
          />
        );
      }
    },
    {
      title: '操作',
      width: 169,
      ellipsis: true,
      fixed: 'right',
      render: (record) => {
        const { id, enabled, policyStatus } = record;
        const { loading: scanLoading } = scanFetches[id] || {};
        return (
          <Space split={<Divider type='vertical'/>}>
            <Button 
              type='link'
              style={{ padding: 0, fontSize: '12px' }} 
              onClick={() => runScan({ id })}
              loading={scanLoading}
              disabled={!enabled || policyStatus === 'pending'}
            >检测</Button>
            <Button 
              type='link'
              style={{ padding: 0, fontSize: '12px' }} 
              disabled={!policyStatus || policyStatus === 'pending'}
              onClick={() => openDetectionDrawer({ id })}
            >查看结果</Button>
          </Space>
        );
      }
    }
  ];


  return <Layout
    extraHeader={<PageHeader
      title='云模板'
      breadcrumb={true}
    />}
  >
    <div className='idcos-card'>
      <Space size={16} direction='vertical' style={{ width: '100%' }}>
        <Space>
          <Select
            style={{ width: 282 }}
            allowClear={true}
            placeholder='请选择组织'
            options={orgOptions}
            optionFilterProp='label'
            showSearch={true}
            onChange={changeOrg}
          />
          <Input.Search
            style={{ width: 240 }}
            allowClear={true}
            placeholder='请输入云模版名称搜索'
            onSearch={(q) => onChangeFormParams({ q })}
          />
        </Space>
        <Table
          columns={columns}
          scroll={{ x: 'min-content', y: 570 }}
          loading={tableLoading}
          {...tableProps}
        />
      </Space>
    </div>
    {bindPolicyGroupModalProps.visible && <BindPolicyGroupModal 
      {...bindPolicyGroupModalProps}
      onClose={closeBindPolicyGroupModal}
    />}
    {detectionDrawerProps.visible && <DetectionDrawer 
      {...detectionDrawerProps}
      onClose={closeDetectionDrawer}
    />}
  </Layout>;
};

export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS(),
    orgs: state.global.get('orgs').toJS()
  };
})(Eb_WP()(CCTList));
