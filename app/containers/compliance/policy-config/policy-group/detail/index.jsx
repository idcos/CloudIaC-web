import React, { useState, useEffect, useRef } from 'react';
import { Button, Table, Row, Input, notification, Select, Col, Card, Drawer } from 'antd';
import history from 'utils/history';
import { chartUtils } from 'components/charts-cfg';

import moment from 'moment';
import { connect } from "react-redux";

import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import projectAPI from 'services/project';
import tplAPI from 'services/tpl';


const { Option } = Select;
const { Search } = Input;

const Index = ({ orgs, visible, toggleVisible }) => {
  const orgId = 'org-c4i8s1rn6m81fm687b0g';
  const projectId = 'p-c4i8scjn6m81fm687b1g';
  const orgList = (orgs || {}).list || [];
  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [],
      total: 0
    }),
    [ projectList, setProjectList ] = useState([]),
    // [ visible, setVisible ] = useState(false),
    [ detectionVisible, setDetectionVisible ] = useState(false),
    [ query, setQuery ] = useState({
      currentPage: 1,
      pageSize: 10,
      searchorgId: undefined,
      searchprojectId: undefined,
      name: ''
    });
  const columns = [
    {
      dataIndex: 'name',
      title: '检测目标'
    },
    {
      dataIndex: 'description',
      title: '目标类型'
    },
    {
      dataIndex: 'tag',
      title: '组织'
    },
    {
      dataIndex: 'repoAddr',
      title: '项目'
    },
    {
      dataIndex: 'repoAddr1',
      title: '创建者'
    },
    {
      dataIndex: 'repoAddr2',
      title: '通过'
    },

    {
      dataIndex: 'repoAddr2',
      title: '不通过'
    },
    {
      dataIndex: 'creator',
      title: '状态'
    },
    {
      dataIndex: 'creator',
      title: '最后更新时间'
    }
  ];
  let CHART = useRef([
    { key: 'policy_group', domRef: useRef(), des: '环境状态占比', ins: null }
  ]);
  const resizeHelper = chartUtils.resizeEvent(CHART);
  
  useEffect(() => {
    resizeHelper.attach();
    return resizeHelper.remove();
  }, []);

  useEffect(() => {
    CHART.current.forEach(chart => {
      if (chart.key === 'policy_group') {
        chartUtils.update(chart, {});
      }
    });
  }, [visible]);

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
  
  return <Drawer
    title='策略组详情'
    placement='right'
    visible={visible}
    onClose={toggleVisible}
    width={1000}
  >
    <div>
      {CHART.current.map(chart => <div>
        <div ref={chart.domRef} style={{ width: '100%', height: 300 }}></div>
      </div>)}
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
  </Drawer>;
};

export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS(),
    orgs: state.global.get('orgs').toJS()
  };
})(Eb_WP()(Index));
