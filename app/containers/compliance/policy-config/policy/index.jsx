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
import { POLICIES_SEVERITY_STATUS_ENUM } from 'constants/types';
import policiesAPI from 'services/policies';
import cgroupsAPI from 'services/cgroups';
import DetailDrawer from './detail-drawer';
import { t } from 'utils/i18n';

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
      title: t('define.name'),
      width: 220,
      ellipsis: true,
      render: (text, record) => (
        <a onClick={() => onOpenDetailsDrawer(record.id)}>
          {text}
        </a>
      )
    },
    {
      dataIndex: 'tags',
      title: t('define.tag'),
      width: 230,
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
      title: t('define.policyGroup'),
      width: 170,
      ellipsis: true
    },
    {
      dataIndex: 'severity',
      title: t('policy.detection.info.field.severity'),
      width: 110,
      ellipsis: true,
      render: (text) => POLICIES_SEVERITY_STATUS_ENUM[text] || '-'
    },
    {
      dataIndex: 'passed',
      title: t('define.scan.status.passed'),
      width: 48
    },
    {
      dataIndex: 'violated',
      title: t('define.scan.status.violated'),
      width: 64
    },
    {
      dataIndex: 'failed',
      title: t('define.scan.status.failed'),
      width: 48
    },
    {
      dataIndex: 'creator',
      title: t('define.creator'),
      width: 92,
      ellipsis: true
    },
    {
      dataIndex: 'updatedAt',
      title: t('define.updateTime'),
      width: 140,
      ellipsis: true,
      render: (text) => moment(text).format('YYYY-M-DD HH:mm')
    },
    {
      title: t('define.action'),
      width: 100,
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
            >{t('define.onlineTest')}</Button>
          </Space>
        );
      }
    }
  ];

  return <Layout
    extraHeader={<PageHeader
      title={t('define.policy')}
      breadcrumb={true}
      subDes={<Button onClick={() => goOnlineTestPage()}>{t('define.onlineTest')}</Button>}
    />}
  >
    <div className='idcos-card'>
      <Space size={16} direction='vertical' style={{ width: '100%' }}>
        <Row justify='space-between' wrap={false}>
          <Col>
            <Space>
              <Select
                style={{ width: 264 }}
                allowClear={true}
                placeholder={t('define.policy.search.policyGroup.placeholder')}
                options={policyGroupOptions}
                optionFilterProp='label'
                showSearch={true}
                value={form.groupId}
                onChange={(groupId) => onChangeFormParams({ groupId })}
              />
              <Select
                style={{ width: 264 }}
                allowClear={true}
                options={Object.keys(POLICIES_SEVERITY_STATUS_ENUM).map(it => ({ label: POLICIES_SEVERITY_STATUS_ENUM[it], value: it }))}
                placeholder={t('define.policy.search.severity.placeholder')}
                onChange={(severity) => onChangeFormParams({ severity })}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <Input
                style={{ width: 320 }}
                allowClear={true}
                placeholder={t('define.policy.search.key.placeholder')}
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
          scroll={{ x: 'min-content' }}
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
