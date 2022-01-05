import React, { useState } from 'react';
import { Button, Table, Input, notification, Space, Divider, Popconfirm, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { useSearchFormAndTable } from 'utils/hooks';
import history from 'utils/history';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import cgroupsAPI from 'services/cgroups';
import RelevancePolicyGroupModal from './component/relevancePolicyGroupModal';

const PolicyGroupList = ({ match }) => {

  const { orgId } = match.params || {};
  const [ policyGroupId, setPolicyGroupId ] = useState(null),
    [ viewRelevance, setViewRelevance ] = useState(false);

  // 策略组列表查询
  const {
    loading: tableLoading,
    data: tableData,
    run: fetchList,
    refresh: refreshList
  } = useRequest(
    (params) => requestWrapper(
      cgroupsAPI.list.bind(null, params)
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

  const enabled = async(value, record) => {
    try { 
      const res = await cgroupsAPI.update({
        enabled: value,
        policyGroupId: record.id
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: '操作成功'
      });
      refreshList();
    } catch (e) {
      notification.error({
        message: '操作失败',
        description: e.message
      });
    }
  };

  const goFormPage = (id) => {
    history.push(`/org/${orgId}/compliance/policy-config/policy-group/form-page/${id || ''}`);
  };

  const columns = [
    {
      dataIndex: 'name',
      title: '策略组名称',
      width: 188,
      ellipsis: true
    },
    {
      dataIndex: 'description',
      title: '描述',
      width: 230,
      ellipsis: true
    },
    {
      dataIndex: 'policyCount',
      title: '关联策略',
      width: 100,
      ellipsis: true,
      render: (text, record) => <a 
        onClick={() => {
          history.push(`/org/${orgId}/compliance/policy-config/policy?groupId=${record.id}`);
        }}
      >{text}</a>
    },
    {
      dataIndex: 'updatedAt',
      title: '最后更新日期',
      width: 180,
      ellipsis: true,
      render: (text) => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
    },
    {
      title: '操作',
      width: 120,
      ellipsis: true,
      fixed: 'right',
      render: (text, record) => {
        return (
          <Space>
            <a 
              onClick={() => goFormPage(record.id)}
            >编辑</a>
            <Popconfirm 
              title={`确认${record.enabled ? '禁用' : '启用'}策略组?`} 
              onConfirm={() => enabled(!record.enabled, record)} 
              placement='bottomLeft'
            >
              <Button type='link' style={{ padding: 0, fontSize: 12 }}>
                {record.enabled ? '禁用' : '启用'}
              </Button>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  return <Layout
    extraHeader={<PageHeader
      title={'策略组'}
      breadcrumb={true}
    />}
  >
    <div className='idcos-card'>
      <Space size={16} direction='vertical' style={{ width: '100%' }}>
        <Row justify='space-between' wrap={false}>
          <Col>
            <Button type={'primary'} onClick={() => goFormPage()}>
              新建策略组
            </Button>
          </Col>
          <Col>
            <Input
              style={{ width: 320 }}
              allowClear={true}
              placeholder='请输入策略组名称搜索'
              prefix={<SearchOutlined />}
              onPressEnter={(e) => {
                const q = e.target.value;
                onChangeFormParams({ q });
              }}
            />
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
    {viewRelevance && <RelevancePolicyGroupModal 
      reload={refreshList} 
      visible={viewRelevance} 
      id={policyGroupId} 
      toggleVisible={() => {
        setViewRelevance(false);
        setPolicyGroupId(null); 
      }}
    />}
  </Layout>;
};

export default PolicyGroupList;
