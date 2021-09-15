import React, { useState, useEffect, useRef } from 'react';
import { Table, notification, Drawer } from 'antd';
import moment from 'moment';
import { connect } from "react-redux";
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { useSearchFormAndTable } from 'utils/hooks';
import { chartUtils } from 'components/charts-cfg';
import { Eb_WP } from 'components/error-boundary'; 
import { POLICIES_DETECTION } from 'constants/types';
import cgroupsAPI from 'services/cgroups';

const Index = ({ visible, toggleVisible, id }) => {
  const [ passedRate, setpassedRate ] = useState({});

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
      dataIndex: 'passed',
      title: '通过'
    },

    {
      dataIndex: 'violated',
      title: '不通过'
    },
    {
      dataIndex: 'status',
      title: '状态',
      render: (t, r) => <span>{POLICIES_DETECTION[t]}</span>
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

  // 表格数据查询
  const {
    loading: tableLoading,
    data: tableData,
    run: fetchList,
  } = useRequest(
    (params) => requestWrapper(
      cgroupsAPI.lastTasksList.bind(null, params)
    ),
    {
      manual: true
    }
  );

  // 表单搜索和table关联hooks
  const { 
    tableProps
  } = useSearchFormAndTable({
    tableData,
    pagination: { hideOnSinglePage: true },
    onSearch: (params) => {
      const { current: currentPage, ...restParams } = params;
      fetchList({ currentPage, ...restParams, policyGroupId: id });
    }
  });

  const valueToPercent = (value) => {
    return Math.round(parseFloat(value) * 10000) / 100;
  };

  const fetchDate = async () => {
    try {
      const res = await cgroupsAPI.report({
        policyGroupId: id,
        from: moment().add(-30, 'd').format(),
        to: moment().format()
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
        loading={tableLoading}
        {...tableProps}
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
