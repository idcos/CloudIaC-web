import React, { useState } from 'react';
import { Table, Space, Select, Divider, Input, notification } from 'antd';
import { connect } from "react-redux";
import { useRequest } from 'ahooks';
import history from 'utils/history';
import { requestWrapper } from 'utils/request';
import { useSearchFormAndTable } from 'utils/hooks';
import BindPolicyModal from 'components/policy-modal';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import cenvAPI from 'services/cenv';
import projectAPI from 'services/project';
import Detection from './component/detection';

const CenvList = ({ orgs }) => {

  const orgOptions = ((orgs || {}).list || []).map(it => ({ label: it.name, value: it.id }));
  const [ viewDetection, setViewDetection ] = useState(false);
  const [ policyView, setPolicyView ] = useState(false);
  const [ templateId, setTemplateId ] = useState(null);

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
      cenvAPI.list.bind(null, params)
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

  const runScan = async (record) => {
    try {
      const res = await cenvAPI.runScan({
        tplId: record.id
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setTemplateId(record.id);
      setViewDetection(true); 
    } catch (e) {
      notification.error({
        message: '操作失败',
        description: e.message
      });
    }
  };

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
      dataIndex: 'passed',
      title: '通过'
    },
    {
      dataIndex: 'failed',
      title: '不通过'
    },
    {
      dataIndex: 'suppressed',
      title: '屏蔽'
    },
    {
      dataIndex: 'status',
      title: '状态'
    },
    {
      title: '操作',
      width: 90,
      fixed: 'right',
      render: (text, record) => {
        return (
          <span className='inlineOp'>
            <a 
              type='link' 
              onClick={() => {
                runScan(record);
              }}
            >检测</a>
            <Divider type={'vertical'}/>
            <a 
              type='link' 
              onClick={() => {
                setTemplateId(record.id);
                setViewDetection(true);
              }}
            >查看结果</a>
            <Divider type={'vertical'}/>
            <a 
              type='link' 
              onClick={() => {
                history.push(`/compliance/compliance-config/env/env-detail`); 
              }}
            >详情</a>
          </span>
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
    {policyView && <BindPolicyModal visible={policyView} toggleVisible={() => setPolicyView(false)}/>}
    {viewDetection && <Detection 
      id={templateId}
      visible={viewDetection} 
      toggleVisible={() => {
        setViewDetection(false);
        setTemplateId(null); 
      }}
    />}
  </Layout>;
};


export default connect((state) => {
  return {
    orgs: state.global.get('orgs').toJS()
  };
})(CenvList);