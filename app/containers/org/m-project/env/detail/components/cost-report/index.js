import React, { useEffect, useRef } from 'react';
import { Card, Row, Col, Space, Spin, Table, Badge } from 'antd';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { useSearchFormAndTable } from 'utils/hooks';
import policiesAPI from 'services/policies';
import { chartUtils } from 'components/charts-cfg';
import { POLICIES_DETECTION, POLICIES_DETECTION_COLOR } from 'constants/types';

export default ({ policyId }) => {
  const cost_pie = useRef();
  const source_has_been_executed = useRef();
  // const policy_running_trend = useRef();
  // const detect_pass_rate = useRef();

  let CHART = useRef([
    { key: 'cost_pie', domRef: cost_pie, ins: null, title: '费用类型' },
    { key: 'cost_stacked_area', domRef: source_has_been_executed, ins: null, title: '费用趋势' }
    // { key: 'policy_running_trend', domRef: policy_running_trend, ins: null },
    // { key: 'detect_pass_rate', domRef: detect_pass_rate, ins: null }
  ]);
  const resizeHelper = chartUtils.resizeEvent(CHART);

  const { loading: reportLoading } = useRequest(
    () => requestWrapper(
      policiesAPI.report.bind(null, policyId)
    ),
    {
      ready: !!policyId,
      onSuccess: (data) => {
        const { policyPassedRate, policyScanCount, scanCount, total } = data || {};
        chartUtils.updateBatch(CHART.current, [
          total,
          scanCount,
          policyScanCount,
          policyPassedRate
        ]);
      }
    }
  );

  const { data: tableData, loading: tableLoading, run: fetchErrorList } = useRequest(
    (params) => requestWrapper(
      policiesAPI.error.bind(null, params)
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
      fetchErrorList({ currentPage, ...restParams, policyId });
    }
  });

  useEffect(() => {
    resizeHelper.attach();
    CHART.current.forEach(chart => {
      chartUtils.update(chart, {});
    });
    return resizeHelper.remove();
  }, []);

  const columns = [
    {
      dataIndex: 'templateName',
      title: '资源类型',
      width: 280,
      ellipsis: true
    },
    {
      dataIndex: 'envName',
      title: '资源属性',
      width: 280,
      ellipsis: true,
      render: (text) => text || '-'
    },
    {
      dataIndex: 'envName',
      title: '实例ID',
      width: 280,
      ellipsis: true,
      render: (text) => text || '-'
    },
    {
      dataIndex: 'envName',
      title: '当月费用（元）',
      width: 280,
      ellipsis: true,
      render: (text) => text || '-'
    },
    {
      dataIndex: 'envName',
      title: '总费用（元）',
      width: 280,
      ellipsis: true,
      render: (text) => text || '-'
    }
  ];

  return (
    <Space direction='vertical' size='middle' style={{ width: '100%', display: 'flex' }}>
      <Spin spinning={reportLoading}>

        <Row gutter={[ 16, 16 ]}>
          {CHART.current.map(chart =>
            <Col span={12}>
              <div className='title'>{chart.title}</div>
              <Card style={{ borderRadius: 4 }}>
                <div ref={chart.domRef} style={{ width: '100%', height: 300 }}/>
              </Card>
            </Col>
          )}
        </Row>
      </Spin>
      <Table
        columns={columns}
        scroll={{ x: 'min-content' }}
        loading={tableLoading}
        {...tableProps}
      />
    </Space>
  );
};
