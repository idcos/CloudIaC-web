import React, { useState, useEffect } from 'react';
import { Button, Table, Input, notification, Badge, Space, Divider, Popconfirm } from 'antd';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { useSearchFormAndTable } from 'utils/hooks';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import cgroupsAPI from 'services/cgroups';
import BindPolicyGroupModal from './component/bindPolicyGroupModal';
import Detail from './detail';
import RelevancePolicyGroupModal from './component/relevancePolicyGroupModal';
import { POLICIES_DETECTION, POLICIES_DETECTION_COLOR_COLLAPSE } from 'constants/types';


const PolicyGroupList = () => {
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
    onChangeFormParams,
    resetPageCurrent,
    searchParams: { formParams, paginate }
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
      fetchList({ ...formParams, ...paginate });
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
      render: (text, record) => <a onClick={() => {
        setViewDetail(true);
        setPolicyGroupId(record.id);
      }}
      >{text}</a>
    },
    {
      dataIndex: 'description',
      title: '描述'
    },
    {
      dataIndex: 'policyCount',
      title: '关联策略',
      render: (text, record) => <a 
        onClick={() => {
          setViewRelevance(true); 
          setPolicyGroupId(record.id);
        }}
      >{text}</a>
    },
    {
      dataIndex: 'updatedAt',
      title: '最后更新日期',
      render: (text) => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
    },
    {
      dataIndex: 'status',
      title: '状态',
      render: (text) => <Badge color={POLICIES_DETECTION_COLOR_COLLAPSE[text]} text={POLICIES_DETECTION[text]} />
    },
    {
      title: '操作',
      width: 160,
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
            <Popconfirm title={`确认${record.enabled ? '禁用' : '启用'}策略组?`} onConfirm={() => enabled(!record.enabled, record)} placement='bottomLeft'>
              {record.enabled ? <a >禁用</a> : <a>启用</a>}
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
          scroll={{ x: 'max-content' }}
          loading={tableLoading}
          {...tableProps}
        />
      </Space>
    </div>
    {visible && (
      <BindPolicyGroupModal 
        reload={() => fetchList({ ...formParams, ...paginate })} 
        id={policyGroupId} 
        visible={visible}
        toggleVisible={() => {
          setVisible(false);
          setPolicyGroupId(null); 
        }}
      />)}
    {viewDetail && <Detail 
      visible={viewDetail} 
      reload={() => fetchList({ ...formParams, ...paginate })}
      id={policyGroupId} 
      toggleVisible={() => {
        setViewDetail(false);
        setPolicyGroupId(null); 
      }
      }
    />}
    {viewRelevance && <RelevancePolicyGroupModal 
      reload={() => fetchList({ ...formParams, ...paginate })} 
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
