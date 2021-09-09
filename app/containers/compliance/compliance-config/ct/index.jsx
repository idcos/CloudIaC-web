import React, { useState } from 'react';
import { Badge, Table, Input, Select, Space, Divider, Switch, Button, notification } from 'antd';
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

import BindPolicyModal from './component/bindPolicyModal';
import DetectionModal from './component/detection-modal';

import { POLICIES_DETECTION, POLICIES_DETECTION_COLOR_COLLAPSE, POLICIES_DETECTION_ICON_COLLAPSE } from 'constants/types';


const CCTList = ({ orgs }) => {
  const orgOptions = ((orgs || {}).list || []).map(it => ({ label: it.name, value: it.id }));
  const [ visible, setVisible ] = useState(false);
  const [ templateId, setTemplateId ] = useState(null);
  const [ detail, setDetail ] = useState([]);
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
    searchParams: { formParams, paginate }
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

  const openPolicy = (record) => {
    setTemplateId(record.id);
    setDetail((record.policyGroups || []).map((it) => it.id));
    setVisible(true);
  };

  const runScan = async (record) => {
    try {
      const res = await ctplAPI.runScan({
        tplId: record.id
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setTemplateId(record.id);
      setDetectionVisible(true); 
    } catch (e) {
      notification.error({
        message: '操作失败',
        description: e.message
      });
    }
  };
  const columns = [
    {
      dataIndex: 'name',
      title: '云模板名称'
    },
    {
      dataIndex: 'policyGroups',
      title: '绑定策略组',
      width: 300,
      render: (policyGroups, record) => {
        return (
          isEmpty(policyGroups) ? (
            <a onClick={() => openPolicy(record)}>绑定</a>
          ) : (
            <a style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'inline-block',
              whiteSpace: 'nowrap',
              width: '300px'
            }} onClick={() => openPolicy(record)} type='link'
            >
              {
                policyGroups.map((it) => it.name).join('、')
              }
            </a>
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
      dataIndex: 'status',
      title: '状态',
      render: (text) => <Badge color={POLICIES_DETECTION_COLOR_COLLAPSE[text]} text={POLICIES_DETECTION[text]} />
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      render: (record) => {
        return (
          <span className='inlineOp'>
            <a onClick={() => {
              runScan(record);
            }}
            >检测</a>
            <Divider type={'vertical'} />
            <a 
              type='link' 
              onClick={() => {
                setTemplateId(record.id);
                setDetectionVisible(true);
              }}
            >查看结果</a>
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
    {visible && <BindPolicyModal 
      visible={visible} 
      id={templateId}
      detail={detail}
      reload={() => fetchList({ ...formParams, ...paginate })}
      toggleVisible={() => {
        setVisible(false); 
        setDetail([]);
      }}
    />}
    {detectionVisible && <DetectionModal
      id={templateId}
      visible={detectionVisible} 
      toggleVisible={() => {
        setDetectionVisible(false); 
        setTemplateId(null);
      }}
    />}
  </Layout>;
};

export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS(),
    orgs: state.global.get('orgs').toJS()
  };
})(Eb_WP()(CCTList));
