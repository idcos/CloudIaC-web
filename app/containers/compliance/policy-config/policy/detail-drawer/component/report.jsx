import React, { useEffect, useRef } from 'react';
import { Card, Row, Col, Space, Spin, Table, Badge } from 'antd';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { useSearchFormAndTable } from 'utils/hooks';
import policiesAPI from 'services/policies';
import { chartUtils } from 'components/charts-cfg';
import { POLICIES_DETECTION, POLICIES_DETECTION_COLOR } from 'constants/types';
import { t } from 'utils/i18n';

export default ({ policyId }) => {
  const proportion_of_results = useRef();
  const source_has_been_executed = useRef();
  const policy_running_trend = useRef();
  const detect_pass_rate = useRef();

  let CHART = useRef([
    { key: 'proportion_of_results', domRef: proportion_of_results, ins: null },
    { key: 'source_has_been_executed', domRef: source_has_been_executed, ins: null },
    { key: 'policy_running_trend', domRef: policy_running_trend, ins: null },
    { key: 'detect_pass_rate', domRef: detect_pass_rate, ins: null }
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
      title: '云模板名称',
      width: 280,
      ellipsis: true
    },
    {
      dataIndex: 'envName',
      title: '环境名称',
      width: 280,
      ellipsis: true,
      render: (text) => text || '-'
    },
    {
      dataIndex: 'status',
      title: t('define.status'),
      width: 120,
      ellipsis: true,
      render: (text) => text ? <Badge color={POLICIES_DETECTION_COLOR[text]} text={POLICIES_DETECTION[text]} /> : '-'
    }
  ];

  return (
    <Space direction='vertical' size='middle' style={{ width: '100%', display: 'flex' }}>
      <Card 
        title='报表内容' 
        type='inner' 
        headStyle={{ borderBottom: 'none', marginBottom: 0 }} 
        bodyStyle={{ minHeight: 300, backgroundColor: 'rgba(230, 240, 240, 0.7)', padding: '0 16px' }}
      >
        <Spin spinning={reportLoading}>
          <Row gutter={[ 16, 16 ]}>
            {CHART.current.map(chart => 
              <Col span={12}>
                <Card bordered={false}>
                  <div ref={chart.domRef} style={{ width: '100%', height: 300 }}></div>
                </Card>
              </Col>
            )}
          </Row>
        </Spin>
      </Card>
      <Card title='错误列表' type='inner' bodyStyle={{ minHeight: 300 }}>
        <Table
          columns={columns}
          scroll={{ x: 'min-content' }}
          loading={tableLoading}
          {...tableProps}
        />
      </Card>
    </Space>
  );
};
