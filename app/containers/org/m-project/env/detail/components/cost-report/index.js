import React, { useEffect, useRef, useState } from 'react';
import { Card, Row, Col, Space, Spin, Table, Badge } from 'antd';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import envAPI from 'services/env';
import { chartUtils } from 'components/charts-cfg';

export default ({ orgId, projectId, envId }) => {
  const cost_type_pie = useRef();
  const cost_stacked_area = useRef();
  const [ list, setList ] = useState([]);

  let CHART = useRef([
    { key: 'cost_type_pie', domRef: cost_type_pie, ins: null, title: '费用类型' },
    { key: 'cost_stacked_area', domRef: cost_stacked_area, ins: null, title: '费用趋势' }
  ]);
  const resizeHelper = chartUtils.resizeEvent(CHART);

  const { loading: reportLoading, run: getReportData } = useRequest(
    () => requestWrapper(
      envAPI.envStatistics.bind(null, { orgId, projectId, envId })
    ),
    {
      ready: !!envId,
      onSuccess: (data) => {
        const { costTypeStat = [], costTrendStat = [], costList } = data || {};
        chartUtils.updateBatch(CHART.current, { 
          costTypeStat, 
          costTrendStat });
        setList(costList);
      }
    }
  );


  useEffect(() => {
    resizeHelper.attach();
    CHART.current.forEach(chart => {
      chartUtils.update(chart, {});
    });
    return resizeHelper.remove();
  }, []);

  const columns = [
    {
      dataIndex: 'resType',
      title: '资源类型',
      width: 150,
      ellipsis: true
    },
    {
      dataIndex: 'resAttr',
      title: '资源属性',
      width: 150,
      ellipsis: true,
      render: (text) => text || '-'
    },
    {
      dataIndex: 'instanceId',
      title: '实例ID',
      width: 150,
      ellipsis: true,
      render: (text) => text || '-'
    },
    {
      dataIndex: 'curMonthCost',
      title: '当月费用（元）',
      width: 80,
      ellipsis: true,
      render: (text) => text || '-'
    },
    {
      dataIndex: 'totalCost',
      title: '总费用（元）',
      width: 80,
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
        loading={reportLoading}
        dataSource={list}
        pagination={false}
      />
    </Space>
  );
};
