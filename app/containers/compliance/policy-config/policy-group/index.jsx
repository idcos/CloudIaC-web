import React, { useState, useEffect } from 'react';
import { Button, Table, Radio, Input, notification, Select, Space, Divider, Popconfirm } from 'antd';
import history from 'utils/history';
import moment from 'moment';
import { connect } from "react-redux";
import BindPolicyGroupModal from './component/bindPolicyGroupModal';
import Detail from './detail';
import RelevancePolicyGroupModal from './component/relevancePolicyGroupModal';

import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import projectAPI from 'services/project';
import tplAPI from 'services/tpl';
import cgroupsAPI from 'services/cgroups';


const { Option } = Select;
const { Search } = Input;

const CTList = ({ orgs }) => {
  const [ resultMap, setResultMap ] = useState({
      list: [],
      total: 0
    }),
    [ query, setQuery ] = useState({
      currentPage: 1,
      pageSize: 10,
      searchorgId: undefined,
      searchprojectId: undefined,
      name: ''
    }),

    [ loading, setLoading ] = useState(false),
    [ policyGroupId, setPolicyGroupId ] = useState([]),
    [ visible, setVisible ] = useState(false),
    [ viewDetail, setViewDetail ] = useState(false),
    [ viewRelevance, setViewRelevance ] = useState(false);

  const columns = [
    {
      dataIndex: 'name',
      title: '策略组名称',
      render: (text) => <a onClick={() => setViewDetail(true)}>{text}</a>
    },
    {
      dataIndex: 'description',
      title: '描述'
    },
    {
      dataIndex: 'tag',
      title: '关联策略',
      render: (text) => <a onClick={() => setVisible(true)}>{text}</a>
    },
    {
      dataIndex: 'repoAddr',
      title: '最后更新日期'
    },
    {
      dataIndex: 'repoAddr1',
      title: '状态'
    },
    {
      title: '操作',
      width: 160,
      render: (text, record) => {
        return (
          <span className='inlineOp'>
            <a 
              type='link' 
              onClick={() => setViewRelevance(true)}
            >关联策略</a>
            <Divider type={'vertical'}/>
            <a 
              onClick={() => {
                setVisible(true); 
                setPolicyGroupId(record.id);
              }}
            >编辑</a>
            <Divider type={'vertical'}/>
            <Popconfirm title='确认禁用策略组?' onConfirm={() => deleteGroup(record.id)} placement='bottomLeft'>
              <a>禁用</a>
            </Popconfirm>
          </span>
        );
      }
    }
  ];

  const deleteGroup = async(id) => {
    try {
      delete query.pageNo;
      const res = await cgroupsAPI.del({
        policiesId: id
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      changeQuery({ currentPage: 1 });
      fetchList();
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  useEffect(() => {
    fetchList();
  }, [query]);

  const fetchList = async () => {
    try {
      setLoading(true);
      delete query.pageNo;
      const res = await cgroupsAPI.list({
        ...query
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setLoading(false);
      setResultMap({
        list: res.result || [],
        total: res.result.total || 0
      });
    } catch (e) {
      setLoading(false);
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const changeQuery = (payload) => {
    setQuery({
      ...query,
      ...payload
    });
  };
  
  return <Layout
    extraHeader={<PageHeader
      title={'策略组'}
      breadcrumb={true}
    />}
  >
    <div className='idcos-card'>
      <Space style={{ marginBottom: 12 }}>
        <Button type={'primary'} onClick={() => setVisible(true)}>新建策略组</Button>
        <Search 
          placeholder='请输入策略组名称搜索' 
          allowClear={true} 
          onSearch={(v) => {
            changeQuery({
              name: v,
              pageNo: 1
            });
          }} 
          style={{ width: 250 }}
        />
      </Space>
      <div>
        <Table
          columns={columns}
          dataSource={resultMap.list}
          loading={loading}
          pagination={{
            current: query.pageNo,
            pageSize: query.pageSize,
            total: resultMap.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共${total}条`,
            onChange: (pageNo, pageSize) => {
              changeQuery({
                currentPage: pageNo,
                pageSize
              });
            }
          }}
        />
      </div>
    </div>
    {visible && (
      <BindPolicyGroupModal 
        reload={() => fetchList()} 
        id={policyGroupId} 
        visible={visible}
        toggleVisible={() => {
          setVisible(false);
          setPolicyGroupId(); 
        }}
      />)}
    {viewDetail && <Detail visible={viewDetail} toggleVisible={() => setViewDetail(false)}/>}
    {viewRelevance && <RelevancePolicyGroupModal reload={() => fetchList()} visible={viewRelevance} toggleVisible={() => setViewRelevance(false)} />}
  </Layout>;
};

export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS(),
    orgs: state.global.get('orgs').toJS()
  };
})(Eb_WP()(CTList));
