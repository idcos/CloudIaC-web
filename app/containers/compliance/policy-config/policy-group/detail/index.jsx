import React, { useState, useEffect, useRef } from 'react';
import { Table, Input, notification, Select, Drawer } from 'antd';
import { chartUtils } from 'components/charts-cfg';

import moment from 'moment';
import { connect } from "react-redux";

import { Eb_WP } from 'components/error-boundary'; 
import cgroupsAPI from 'services/cgroups';

const Index = ({ orgs, visible, toggleVisible, id }) => {
  const [ loading, setLoading ] = useState(false),
    [ passedRate, setpassedRate ] = useState({}),
    [ resultMap, setResultMap ] = useState({
      list: [],
      total: 0
    }),
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
      dataIndex: 'targetName',
      title: '检测目标'
    },
    {
      dataIndex: 'targetType',
      title: '目标类型'
    },
    {
      dataIndex: 'orgName',
      title: '组织'
    },
    {
      dataIndex: 'projectName',
      title: '项目'
    },
    {
      dataIndex: 'creator',
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
      dataIndex: 'updatedAt',
      title: '最后更新时间',
      render: (text) => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
    }
  ];
  let CHART = useRef([
    { key: 'policy_group', domRef: useRef(), des: '环境状态占比', ins: null }
  ]);
  const resizeHelper = chartUtils.resizeEvent(CHART);
  
  useEffect(() => {
    fetchDate();
    resizeHelper.attach();
    return resizeHelper.remove();
  }, []);

  useEffect(() => {
    CHART.current.forEach(chart => {
      if (chart.key === 'policy_group') {
        chartUtils.update(chart, passedRate);
      }
    });
  }, [ visible, passedRate ]);

  useEffect(() => {
    fetchList();
  }, [query]);

  const valueToPercent = (value) => {
    return Math.round(parseFloat(value) * 10000) / 100;
  };

  const fetchDate = async () => {
    try {
      const res = await cgroupsAPI.report({
        policyGroupId: id
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      let obj = res.result.passedRate || {};
      if (!!obj['value']) {
        obj['value'] = obj['value'].map(d => valueToPercent(d)); 
      }
      setpassedRate(obj || {});
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const fetchList = async () => {
    try {
      setLoading(true);
      delete query.pageNo;
      const res = await cgroupsAPI.lastTasksList({
        policyGroupId: id
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
        pagination={false}
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
