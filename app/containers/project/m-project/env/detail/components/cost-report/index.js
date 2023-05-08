import React, { useEffect, useRef, useState } from 'react';
import { Card, Row, Col, Space, Spin, Table } from 'antd';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import envAPI from 'services/env';
import { chartUtils } from 'components/charts-cfg';
import { t } from 'utils/i18n';
import { SUBSCRIPTION_TYPE_ENUM, DISK_TYPE_ENUM } from 'constants/types';

const CostReport = ({ orgId, projectId, envId }) => {
  const cost_type_pie = useRef();
  const cost_stacked_area = useRef();
  const [list, setList] = useState([]);

  const wrapperRef = useRef();
  let CHART = useRef([
    {
      key: 'cost_type_pie',
      domRef: cost_type_pie,
      ins: null,
      title: t('define.resource.curMonthCostType'),
    },
    {
      key: 'cost_stacked_area',
      domRef: cost_stacked_area,
      ins: null,
      title: t('define.resource.environmentCostTrend'),
    },
  ]);
  const resizeHelper = chartUtils.resizeEventOfDomRef(
    CHART.current,
    wrapperRef,
  );

  const { loading: reportLoading } = useRequest(
    () =>
      requestWrapper(
        envAPI.envStatistics.bind(null, { orgId, projectId, envId }),
      ),
    {
      ready: !!envId,
      onSuccess: data => {
        const { costTypeStat = [], costTrendStat = [], costList } = data || {};
        chartUtils.updateBatch(CHART.current, {
          costTypeStat,
          costTrendStat,
        });
        setList(costList);
      },
    },
  );

  useEffect(() => {
    resizeHelper.attach();
    CHART.current.forEach(chart => {
      chartUtils.update(chart, {});
    });
    return () => resizeHelper.remove();
  }, [wrapperRef.current]);

  const columns = [
    {
      dataIndex: 'resType',
      title: t('env.resource.mode.type'),
      width: 150,
      ellipsis: true,
    },
    {
      dataIndex: 'instanceSpec',
      title: t('env.resource.instanceSpec'),
      width: 150,
      ellipsis: true,
      render: text => (text && DISK_TYPE_ENUM[text]) || text || '-',
    },
    {
      dataIndex: 'subscriptionType',
      title: t('env.resource.subscriptionType'),
      width: 80,
      ellipsis: true,
      render: text => (text && SUBSCRIPTION_TYPE_ENUM[text]) || text || '-',
    },

    {
      dataIndex: 'instanceId',
      title: t('define.resource.instanceID'),
      width: 150,
      ellipsis: true,
      render: text => text || '-',
    },
    {
      dataIndex: 'curMonthCost',
      title: t('define.resource.curMonthCost'),
      width: 80,
      ellipsis: true,
      render: text => text || '-',
    },
    {
      dataIndex: 'totalCost',
      title: t('define.resource.totalCost'),
      width: 80,
      ellipsis: true,
      render: text => text || '-',
    },
  ];
  return (
    <Space
      direction='vertical'
      size='middle'
      style={{ width: '100%', display: 'flex' }}
    >
      <Spin spinning={reportLoading}>
        <Row gutter={[16, 16]} ref={wrapperRef}>
          {CHART.current.map(chart => (
            <Col span={12}>
              <div className='title'>{chart.title}</div>
              <Card style={{ borderRadius: 4 }}>
                <div
                  ref={chart.domRef}
                  style={{ width: '100%', height: 300 }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>
      <div className='title'>{t('define.resource.activeExpenses')}</div>
      <Table
        columns={columns}
        scroll={{ x: 'min-content' }}
        loading={reportLoading}
        dataSource={list}
        pagination={false}
      />
    </Space>
  );
};

export default CostReport;
