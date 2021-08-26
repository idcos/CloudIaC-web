import React, { useState, useEffect } from 'react';
import { Button, Table, Radio, Input, notification, Select, Space, Divider, Switch } from 'antd';
import history from 'utils/history';
import moment from 'moment';
import { connect } from "react-redux";

import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import projectAPI from 'services/project';
import tplAPI from 'services/tpl';
import BindStrategyModal from 'components/strategy-modal';
import DetectionModal from './component/detection-modal';


const { Option } = Select;
const { Search } = Input;

const CTList = ({ orgs }) => {
  const orgId = 'org-c4i8s1rn6m81fm687b0g';
  const projectId = 'p-c4i8scjn6m81fm687b1g';
  const orgList = (orgs || {}).list || [];
  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [],
      total: 0
    }),
    [ projectList, setProjectList ] = useState([]),
    [ visible, setVisible ] = useState(false),
    [ detectionVisible, setDetectionVisible ] = useState(false),
    [ query, setQuery ] = useState({
      currentPage: 1,
      pageSize: 10,
      searchorgId: undefined,
      searchprojectId: undefined,
      name: ''
    });
  const openStrategy = () => {
    setVisible(true);
  };
  const columns = [
    {
      dataIndex: 'name',
      title: '云模板名称'
    },
    {
      dataIndex: 'description',
      title: '绑定策略组',
      render: (text) => <a onClick={openStrategy}>{text}</a>
    },
    {
      dataIndex: 'repoAddr',
      title: '仓库地址',
      render: (text) => <a href={text} target='_blank'>{text}</a>
    },
    {
      dataIndex: 'activeEnvironment',
      title: '是否开启检测',
      render: (text) => <Switch value={true} />
    },
    {
      dataIndex: 'creator',
      title: '状态'
    },
    {
      title: '操作',
      width: 90,
      render: (record) => {
        return (
          <span className='inlineOp'>
            <a 
              onClick={() => setDetectionVisible(true)}
            >检测</a>
            <Divider type={'vertical'} />
            <a 
              onClick={() => setDetectionVisible(true)}
            >删除</a>
          </span>
        );
      }
    }
  ];

  useEffect(() => {
    fetchList();
  }, [query]);

  const fetchList = async () => {
    try {
      setLoading(true);
      delete query.pageNo;
      const res = await tplAPI.list({
        orgId,
        ...query
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setLoading(false);
      setResultMap({
        list: res.result.list || [],
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
  const selectOrg = async(e) => {
    try {
      const res = await projectAPI.allEnableProjects({
        status: 'enable',
        pageSize: 100000,
        currentPage: 1,
        orgId: e
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setProjectList(res.result.list || []);
    } catch (e) {
      setLoading(false);
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };
  
  return <Layout
    extraHeader={<PageHeader
      title='云模板'
      breadcrumb={true}
    />}
  >
    <div className='idcos-card'>
      <Space style={{ marginBottom: 12 }}>
        <Select 
          style={{ width: 240 }}  
          onChange={(e) => {
            selectOrg(e); changeQuery({ searchorgId: e }); 
          }}
          allowClear={true}
          placeholder={`请选择组织`}
        >
          {orgList.map(it => <Option value={it.id}>{it.name}</Option>)}
        </Select>
        <Select 
          style={{ width: 240 }}  
          onChange={(e) => {
            changeQuery({
              searchprojectId: e
            });
          }}
          allowClear={true}
          placeholder={`请选择项目`}
        >
          {projectList.map(it => <Option value={it.id}>{it.name}</Option>)}
        </Select>
        <Search 
          placeholder='请输入云模板名称搜索' 
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
    <BindStrategyModal visible={visible} />
    <DetectionModal visible={detectionVisible} />
  </Layout>;
};

export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS(),
    orgs: state.global.get('orgs').toJS()
  };
})(Eb_WP()(CTList));
