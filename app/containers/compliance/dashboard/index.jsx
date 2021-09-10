import React, { useState, useEffect } from 'react';
import { Row, Col, Input, notification, Badge, Card, Divider, Popconfirm } from 'antd';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { useSearchFormAndTable } from 'utils/hooks';
import cgroupsAPI from 'services/cgroups';
import { POLICIES_DETECTION, POLICIES_DETECTION_COLOR_COLLAPSE } from 'constants/types';
import styles from './style.less';
import Active from './component/active';
import Unsolved from './component/unsolved';
import Policy from './component/policy';
import PolicyGroup from './component/policy-group';


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

  return <div className={styles.dashboard}>
    <Row>
      <Col span={16} style={{ paddingRight: 24 }}>
        <Active/>
      </Col>
      <Col span={8}>
        <Unsolved/>
      </Col>
    </Row>
    <Row style={{ paddingTop: 24 }}>
      <Col span={12} style={{ paddingRight: 12 }}>
        <Policy/>
      </Col>
      <Col span={12} style={{ paddingLeft: 12 }}>
        <PolicyGroup/>
      </Col>
    </Row>
  </div>;
};

export default PolicyGroupList;
