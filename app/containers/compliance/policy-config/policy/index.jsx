import React, { useState, useCallback } from 'react';
import { Button, Table, Space, Input, Select, Divider, Tag, Popover, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import pick from 'lodash/pick';
import queryString from 'query-string';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import history from 'utils/history';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import EllipsisText from 'components/EllipsisText';
import { useSearchFormAndTable } from 'utils/hooks';
import { POLICIES_SEVERITY_ENUM } from 'constants/types';
import policiesAPI from 'services/policies';
import cgroupsAPI from 'services/cgroups';
import DetailDrawer from './detail-drawer';

const Policy = ({ location, match }) => {

  const { orgId } = match.params || {};
  const searchQuery = queryString.parse(location.search) || {};
  const [ detailDrawerState, setDetailsDrawerState ] = useState({
    visible: false,
    id: null
  });

  // 策略组选项查询
  const { data: policyGroupOptions } = useRequest(
    () => requestWrapper(
      cgroupsAPI.list.bind(null, { pageSize: 0 }),
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
    searchParams: { form },
    onChangeFormParams
  } = useSearchFormAndTable({
    tableData,
    defaultSearchParams: {
      form: pick(searchQuery, ['groupId'])
    },
    onSearch: (params) => {
      const { current: currentPage, ...restParams } = params;
      fetchList({ currentPage, ...restParams });
    }
  });

  // 访问在线测试页面
  const goOnlineTestPage = (id) => {
    history.push(`/org/${orgId}/compliance/policy-config/policy/online-test/${id || ''}`);
  };

  // 打开详情抽屉
  const onOpenDetailsDrawer = (id) => {
    setDetailsDrawerState({
      visible: true,
      id
    });
  };

  // 关闭详情抽屉
  const onCloseDetailsDrawer = () => {
    setDetailsDrawerState({
      visible: false,
      id: null
    });
  };

  const EllipsisTag = useCallback(({ children }) => (
    <Tag style={{ maxWidth: 120, height: 22, margin: 0 }}>
      <EllipsisText>{children}</EllipsisText>
    </Tag>
  ), []);

  const columns = [
    {
      dataIndex: 'name',
      title: '策略名称',
      width: 138,
      ellipsis: true,
      render: (text, record) => (
        <a onClick={() => onOpenDetailsDrawer(record.id)}>
          {text}
        </a>
      )
    },
    {
      dataIndex: 'tags',
      title: '标签',
      width: 166,
      render: (text) => {
        const tags = text ? text.split(',') : [];
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {
              tags.slice(0, 3).map((it) => <EllipsisTag>{it}</EllipsisTag>)
            }
            {
              tags.length > 3 && (
                <Popover 
                  content={
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {tags.map((it) => <EllipsisTag>{it}</EllipsisTag>)}
                    </div>
                  }
                >
                  <span>
                    <EllipsisTag>...</EllipsisTag>
                  </span>
                </Popover>
              )
            }
          </div>
        );
      }
    },
    {
      dataIndex: 'groupName',
      title: '策略组',
      width: 166,
      ellipsis: true
    },
    {
      dataIndex: 'severity',
      title: '严重性',
      width: 70,
      ellipsis: true,
      render: (text) => POLICIES_SEVERITY_ENUM[text]
    },
    {
      dataIndex: 'passed',
      title: '通过',
      width: 66,
      ellipsis: true
    },
    {
      dataIndex: 'violated',
      title: '不通过',
      width: 69,
      ellipsis: true
    },
    {
      dataIndex: 'failed',
      title: '失败',
      width: 56,
      ellipsis: true
    },
    {
      dataIndex: 'creator',
      title: '创建者',
      width: 92,
      ellipsis: true
    },
    {
      dataIndex: 'updatedAt',
      title: '最后更新时间',
      width: 140,
      ellipsis: true,
      render: (text) => moment(text).format('YYYY-M-DD HH:mm')
    },
    {
      title: '操作',
      width: 80,
      ellipsis: true,
      fixed: 'right',
      render: (record) => {
        const { id } = record;
        return (
          <Space split={<Divider type='vertical'/>}>
            <Button 
              style={{ padding: 0, fontSize: '12px' }} 
              type='link' 
              onClick={() => goOnlineTestPage(id)}
            >在线测试</Button>
          </Space>
        );
      }
    }
  ];

  return <Layout
    extraHeader={<PageHeader
      title='策略'
      breadcrumb={true}
      subDes={<Button onClick={() => goOnlineTestPage()}>在线测试</Button>}
    />}
  >
    <div className='idcos-card'>
      <Space size={16} direction='vertical' style={{ width: '100%' }}>
        <Row justify='space-between' wrap={false}>
          <Col>
          </Col>
          <Col>
            <Space>
              <Select
                style={{ width: 264 }}
                allowClear={true}
                placeholder='请选择策略组'
                options={policyGroupOptions}
                optionFilterProp='label'
                showSearch={true}
                value={form.groupId}
                onChange={(groupId) => onChangeFormParams({ groupId })}
              />
              <Select
                style={{ width: 264 }}
                allowClear={true}
                options={Object.keys(POLICIES_SEVERITY_ENUM).map(it => ({ label: POLICIES_SEVERITY_ENUM[it], value: it }))}
                placeholder='请选择严重性'
                onChange={(severity) => onChangeFormParams({ severity })}
              />
              <Input
                style={{ width: 320 }}
                allowClear={true}
                placeholder='请输入策略名称或标签搜索'
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
    {
      detailDrawerState.visible && (
        <DetailDrawer 
          visible={detailDrawerState.visible} 
          id={detailDrawerState.id} 
          onClose={onCloseDetailsDrawer} 
          reloadPolicyList={refreshList}
        />
      )
    }
  </Layout>;
};

export default Policy;
