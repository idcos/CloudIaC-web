import React, { useState } from 'react';
import { Badge, Table, Input, Select, Space, Divider, Switch, Button } from 'antd';
import { connect } from "react-redux";
import { useRequest } from 'ahooks';
import isEmpty from 'lodash/isEmpty';
import { useSearchFormAndTable } from 'utils/hooks';
import { requestWrapper } from 'utils/request';
import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import projectAPI from 'services/project';
import ctplAPI from 'services/ctpl';
import BindPolicyModal from 'components/policy-modal';
import DetectionModal from './component/detection-modal';

const CCTList = ({ orgs }) => {
  const orgOptions = ((orgs || {}).list || []).map(it => ({ label: it.name, value: it.id }));
  const [ visible, setVisible ] = useState(false);
  const [ detectionVisible, setDetectionVisible ] = useState(false);

  // 项目选项查询
  const { data: projectOptions = [], run: fetchProjectOptions, mutate: mutateProjectOptions } = useRequest(
    (orgId) => requestWrapper(
      projectAPI.allEnableProjects.bind(null, { orgId }),
      {
        formatDataFn: (res) => ((res.result || {}).list || []).map((it) => ({ label: it.name, value: it.id }))
      }
    ),
    {
      manual: true
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
    searchParams: { formParams }
  } = useSearchFormAndTable({
    tableData,
    onSearch: (params) => {
      const { current: currentPage, ...restParams } = params;
      fetchList({ currentPage, ...restParams });
    }
  });

  const changeOrg = (orgId) => {
    onChangeFormParams({ orgId, projectId: undefined });
    if (orgId) {
      fetchProjectOptions(orgId);
    } else {
      mutateProjectOptions([]);
    }
  };

  const openPolicy = () => {
    setVisible(true);
  };

  const columns = [
    {
      dataIndex: 'name',
      title: '云模板名称'
    },
    {
      dataIndex: 'policyGroups',
      title: '绑定策略组',
      width: 150,
      render: (policyGroups) => {
        return (
          isEmpty(policyGroups) ? (
            <Button type='link'>绑定</Button>
          ) : (
            <Button type='link'>
              {
                policyGroups.map((it) => it.name).join('、')
              }
            </Button>
          )
        ); 
      }
    },
    {
      dataIndex: 'repoAddr',
      title: '仓库地址',
      render: (text) => <a href={text} target='_blank'>{text}</a>
    },
    {
      dataIndex: 'enabled',
      title: '是否开启检测',
      render: (text) => <Switch checked={text} />
    },
    {
      dataIndex: 'groupStatus',
      title: '状态',
      render: (text) => <Badge color={'red'} text={text} />
    },
    {
      title: '操作',
      width: 90,
      fixed: 'right',
      render: (record) => {
        return (
          <span className='inlineOp'>
            <a 
              onClick={() => setDetectionVisible(true)}
            >检测</a>
          </span>
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
      <Space size={16} direction='vertical' style={{ width: '100%'}}>
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
          <Select
            style={{ width: 282 }}
            allowClear={true}
            options={projectOptions}
            placeholder='请选择项目'
            value={formParams.projectId}
            onChange={(projectId) => onChangeFormParams({ projectId })}
          />
          <Input.Search
            style={{ width: 240 }}
            allowClear={true}
            placeholder='请输入环境名称搜索'
            onSearch={(q) => onChangeFormParams({ q })}
          />
        </Space>
        <Table
          columns={columns}
          scroll={{ x: 'max-content' }}
          loading={tableLoading}
          {...tableProps}
        />
      </Space>
    </div>
    {visible && <BindPolicyModal visible={visible} toggleVisible={() => setVisible(false)}/>}
    {detectionVisible && <DetectionModal visible={detectionVisible} toggleVisible={() => setDetectionVisible(false)}/>}
  </Layout>;
};

export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS(),
    orgs: state.global.get('orgs').toJS()
  };
})(Eb_WP()(CCTList));
