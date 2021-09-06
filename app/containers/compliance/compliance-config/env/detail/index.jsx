import React, { useState } from 'react';
import { Button, Table, Space, Input, Select, Divider, Tag } from 'antd';
import { useRequest } from 'ahooks';
import moment from 'moment';
import { requestWrapper } from 'utils/request';
import history from 'utils/history';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import { useSearchFormAndTable } from 'utils/hooks';
import { POLICIES_SEVERITY_ENUM } from 'constants/types';
import policiesAPI from 'services/policies';
import cgroupsAPI from 'services/cgroups';

const Index = () => {
  
  const [ detailDrawerState, setDetailsDrawerState ] = useState({
    visible: false,
    id: null
  });

  // 策略组选项查询
  const { data: policyGroupOptions } = useRequest(
    () => requestWrapper(
      cgroupsAPI.list.bind(null, { currentPage: 1, pageSize: 100000 }),
      {
        formatDataFn: (res) => ((res.result || {}).list || []).map((it) => ({ label: it.name, value: it.id }))
      }
    )
  );

  // 策略列表查询
  const {
    loading: tableLoading,
    data: tableData,
    run: fetchList,
    refresh: refreshList
  } = useRequest(
    (params) => requestWrapper(
      policiesAPI.list.bind(null, params)
    ), {
      manual: true
    }
  );

  // 表单搜索和table关联hooks
  const { 
    tableProps, 
    onChangeFormParams
  } = useSearchFormAndTable({
    tableData,
    onSearch: (params) => {
      const { current: currentPage, ...restParams } = params;
      fetchList({ currentPage, ...restParams });
    }
  });

  const columns = [
    {
      dataIndex: 'name',
      title: '策略名称',
      render: (text, record) => {
        return <span>{text}</span>;
      }
    },
    {
      dataIndex: 'tags',
      title: '标签',
      render: (text) => {
        const tags = text ? text.split(',') : [];
        return (
          <>
            {
              tags.slice(0, 3).map((it) => <Tag>{it}</Tag>)
            }
            {
              tags.length > 3 && <Tag>+{tags.length - 3}</Tag>
            }
          </>
        );
      }
    },
    {
      dataIndex: 'groupId',
      title: '策略组'
      // render: (text) => <a href={text} target='_blank'>{text}</a>
    },
    {
      dataIndex: 'severity',
      title: '严重性',
      render: (text) => POLICIES_SEVERITY_ENUM[text]
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
      dataIndex: 'creator',
      title: '创建者'
    },
    {
      dataIndex: 'updatedAt',
      title: '最后更新时间',
      render: (text) => moment(text).format('YYYY-M-DD HH:mm')
    }
  ];

  return <Layout
    extraHeader={<PageHeader
      title='策略'
      breadcrumb={true}
    />}
  >
    <div className='idcos-card'>
      <Space size={16} direction='vertical' style={{ width: '100%' }}>
        <Space>
          <Select
            style={{ width: 282 }}
            allowClear={true}
            placeholder='请选择策略组'
            options={policyGroupOptions}
            getPopupContainer={triggerNode => triggerNode.parentNode}
            optionFilterProp='label'
            showSearch={true}
            onChange={(groupId) => onChangeFormParams({ groupId })}
          />
          <Select
            style={{ width: 282 }}
            allowClear={true}
            options={Object.keys(POLICIES_SEVERITY_ENUM).map(it => ({ label: POLICIES_SEVERITY_ENUM[it], value: it }))}
            getPopupContainer={triggerNode => triggerNode.parentNode}
            placeholder='请选择严重性'
            onChange={(severity) => onChangeFormParams({ severity })}
          />
          <Input.Search
            style={{ width: 240 }}
            allowClear={true}
            placeholder='请输入策略名称搜索'
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
  </Layout>;
};

export default Index;
