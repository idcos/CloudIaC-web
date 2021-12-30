import React, { useState } from 'react';
import { Button, Table, Input, notification, Space, Divider, Popconfirm } from 'antd';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { useSearchFormAndTable } from 'utils/hooks';
import history from 'utils/history';
import PageHeader from 'components/pageHeader';
import EllipsisText from 'components/EllipsisText';
import Layout from 'components/common/layout';
import cgroupsAPI from 'services/cgroups';
import BindPolicyGroupModal from './component/bindPolicyGroupModal';
import Detail from './detail';
import RelevancePolicyGroupModal from './component/relevancePolicyGroupModal';

const PolicyGroupList = ({ match }) => {

  const { orgId } = match.params || {};
  const [ policyGroupId, setPolicyGroupId ] = useState(null),
    [ visible, setVisible ] = useState(false),
    [ viewDetail, setViewDetail ] = useState(false),
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

  const columns = [
    {
      dataIndex: 'name',
      title: '策略组名称',
      width: 188,
      ellipsis: true,
      render: (text, record) => (
        <a
          onClick={() => {
            setViewDetail(true);
            setPolicyGroupId(record.id);
          }}
        >
          <EllipsisText>{text}</EllipsisText>
        </a>
      )
    },
    {
      dataIndex: 'description',
      title: '描述',
      width: 230,
      ellipsis: true,
      render: (text) => <EllipsisText maxWidth={180}>{text}</EllipsisText>
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
      title: '操作',
      width: 208,
      ellipsis: true,
      fixed: 'right',
      render: (text, record) => {
        return (
          <span className='inlineOp'>
            <a 
              type='link' 
              onClick={() => {
                setViewRelevance(true); 
                setPolicyGroupId(record.id);
              }}
            >关联策略</a>
            <Divider type={'vertical'}/>
            <a 
              onClick={() => {
                setVisible(true); 
                setPolicyGroupId(record.id);
              }}
            >编辑</a>
            <Divider type={'vertical'}/>
            <Popconfirm 
              title={`确认${record.enabled ? '禁用' : '启用'}策略组?`} 
              onConfirm={() => enabled(!record.enabled, record)} 
              placement='bottomLeft'
            >
              <Button type='link' style={{ padding: 0, fontSize: 12 }}>
                {record.enabled ? '禁用' : '启用'}
              </Button>
            </Popconfirm>
          </span>
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
        <Space>
          <Button type={'primary'} onClick={() => setVisible(true)}>
            新建策略组
          </Button>
          <Input.Search
            style={{ width: 240 }}
            allowClear={true}
            placeholder='请输入策略组名称搜索'
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
    {visible && (
      <BindPolicyGroupModal 
        reload={refreshList} 
        id={policyGroupId} 
        visible={visible}
        toggleVisible={() => {
          setVisible(false);
          setPolicyGroupId(null); 
        }}
      />)}
    {viewDetail && <Detail 
      visible={viewDetail} 
      reload={refreshList}
      id={policyGroupId} 
      toggleVisible={() => {
        setViewDetail(false);
        setPolicyGroupId(null); 
      }
      }
    />}
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
