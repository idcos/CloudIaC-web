import React, { useState } from 'react';
import { Table, Space, Select, Divider, Input, Badge, Button, Modal, Switch, Row, Col } from 'antd';
import { ExclamationCircleFilled, SearchOutlined } from '@ant-design/icons';
import noop from 'lodash/noop';
import { connect } from "react-redux";
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { useSearchFormAndTable } from 'utils/hooks';
import BindPolicyGroupModal from './component/bindPolicyGroupModal';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import cenvAPI from 'services/cenv';
import projectAPI from 'services/project';
import DetectionDrawer from './component/detection-drawer';
import PolicyStatus from 'components/policy-status';
import { useLoopPolicyStatus } from 'utils/hooks';
import { SCAN_DISABLE_STATUS, SCAN_DETAIL_DISABLE_STATUS } from 'constants/types';

const CenvList = () => {

  const { check } = useLoopPolicyStatus();
  const [ bindPolicyGroupModalProps, setBindPolicyGroupModalProps ] = useState({
    visible: false,
    id: null,
    title: '',
    tplId: null,
    policyGroupIds: [],
    onSuccess: noop
  });
  const [ detectionDrawerProps, setDetectionDrawerProps ] = useState({
    visible: false,
    id: null
  });

  // 项目选项查询
  const { data: projectOptions = [] } = useRequest(
    () => requestWrapper(
      projectAPI.allEnableProjects.bind(null, {}),
      {
        formatDataFn: (res) => ((res.result || {}).list || []).map((it) => ({ label: it.name, value: it.id }))
      }
    )
  );

  // 启用/禁用云模版扫描
  const {
    run: changeEnabled,
    fetches: changeEnabledFetches
  } = useRequest(
    (params) => requestWrapper(
      cenvAPI.enabled.bind(null, params),
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
      cenvAPI.runScan.bind(null, { envId: id })
    ), {
      manual: true,
      fetchKey: (params) => params.id,
      onSuccess: (data, params) => {
        const { id } = params[0] || {};
        openDetectionDrawer({ id });
        refreshList();
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
      cenvAPI.list.bind(null, params)
    ), {
      manual: true,
      onSuccess: (data) => {
        check({ 
          list: data.list || [],
          loopFn: () => refreshList()
        });
      }
    }
  );

  // 表单搜索和table关联hooks
  const { 
    tableProps, 
    onChangeFormParams,
    searchParams: { form }
  } = useSearchFormAndTable({
    tableData,
    onSearch: (params) => {
      const { current: currentPage, ...restParams } = params;
      fetchList({ currentPage, ...restParams });
    }
  });

  const openDetectionDrawer = ({ id }) => {
    setDetectionDrawerProps({
      id,
      visible: true
    });
  };

  // 关闭检测详情
  const closeDetectionDrawer = () => {
    setDetectionDrawerProps({
      id: null,
      visible: false
    });
  };

  const openBindPolicyGroupModal = ({ id, title, tplId, policyGroups }, onSuccess = refreshList) => {
    setBindPolicyGroupModalProps({
      visible: true,
      policyGroupIds: (policyGroups || []).map((it) => it.id),
      id,
      title,
      tplId,
      onSuccess
    });
  };

  const closeBindPolicyGroupModal = () => {
    setBindPolicyGroupModalProps({
      visible: false,
      policyGroupIds: [],
      id: null,
      title: '',
      tplId: null,
      onSuccess: noop
    });
  };

  // 开启/关闭合规检测
  const switchEnabled = ({ enabled, id, tplId, policyGroups, name }) => {
    if (enabled) {
      openBindPolicyGroupModal({ id, tplId, policyGroups, title: '开启合规检测' }, () => {
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
      title: '环境名称',
      width: 152,
      ellipsis: true
    },
    {
      dataIndex: 'policyGroups',
      title: '绑定策略组',
      width: 200,
      ellipsis: true,
      render: (text, record) => {
        const policyGroups = text || [];
        return (
          <a onClick={() => openBindPolicyGroupModal({ ...record, title: '绑定策略组' })}>
            {policyGroups.length > 0 ? (
              policyGroups.map(it => it.name).join('、')
            ) : '-'}
          </a>
        ); 
      }
    },
    {
      dataIndex: 'policyStatus',
      title: '状态',
      width: 94,
      render: (policyStatus, record) => {
        const clickProps = {
          style: { cursor: 'pointer' },
          onClick: () => openDetectionDrawer(record)
        };
        return (
          <PolicyStatus policyStatus={policyStatus} clickProps={clickProps}/>
        );
      }
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
      width: 67,
      ellipsis: true
    },
    {
      dataIndex: 'suppressed',
      title: '屏蔽',
      width: 62,
      ellipsis: true
    },
    {
      dataIndex: 'failed',
      title: '失败',
      width: 70,
      ellipsis: true
    },
    {
      dataIndex: 'projectName',
      title: '项目名称',
      width: 132,
      ellipsis: true
    },
    {
      dataIndex: 'templateName',
      title: '云模板名称',
      width: 132,
      ellipsis: true
    },
    {
      dataIndex: 'policyEnable',
      title: '开启检测',
      width: 75,
      ellipsis: true,
      fixed: 'right',
      render: (policyEnable, record) => {
        const { id, name, tplId, policyGroups } = record;
        return (
          <Switch 
            checked={policyEnable} 
            size='small' 
            onChange={(checked) => switchEnabled({ enabled: checked, id, tplId, policyGroups, name })} 
          />
        );
      }
    },
    {
      title: '操作',
      width: 169,
      ellipsis: true,
      fixed: 'right',
      render: (text, record) => {
        const { id, policyEnable, policyStatus } = record;
        const { loading: scanLoading } = scanFetches[id] || {};
        return (
          <Space split={<Divider type='vertical'/>}>
            <Button 
              type='link'
              style={{ padding: 0, fontSize: '12px' }} 
              onClick={() => runScan({ id })}
              loading={scanLoading}
              disabled={SCAN_DISABLE_STATUS.includes(policyStatus)}
            >检测</Button>
            <Button 
              type='link'
              style={{ padding: 0, fontSize: '12px' }} 
              disabled={SCAN_DETAIL_DISABLE_STATUS.includes(policyStatus)}
              onClick={() => openDetectionDrawer({ id })}
            >查看结果</Button>
          </Space>
        );
      }
    }
  ];

  return <Layout
    extraHeader={<PageHeader
      title='环境'
      breadcrumb={true}
    />}
  >
    <div className='idcos-card'>
      <Space size={16} direction='vertical' style={{ width: '100%' }}>
        <Row justify='space-between' wrap={false}>
          <Col></Col>
          <Col>
            <Space>
              <Select
                style={{ width: 282 }}
                allowClear={true}
                options={projectOptions}
                placeholder='请选择项目'
                value={form.projectId}
                onChange={(projectId) => onChangeFormParams({ projectId })}
              />
              <Input
                style={{ width: 320 }}
                allowClear={true}
                placeholder='请输入环境名称搜索'
                prefix={<SearchOutlined />}
                onPressEnter={(e) => {
                  const q = e.target.value;
                  onChangeFormParams({ q });
                }}
              />
            </Space>
          </Col>
        </Row>
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
    orgs: state.global.get('orgs').toJS()
  };
})(CenvList);