import React, { useState, useEffect, useRef } from 'react';
import { Card, Spin, Radio, Input, notification, Row, Col, Button, Form } from 'antd';

import { Eb_WP } from 'components/error-boundary';
import { chartUtils } from 'components/charts-cfg';
import projectAPI from 'services/project';

const FL = {
  labelCol: { span: 6 },
  wrapperCol: { span: 10 }
};

const Basic = ({ visible, orgId, projectId, dispatch }) => {
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

  useEffect(() => {
    resizeHelper.attach();
    return resizeHelper.remove();
  }, []);

  useEffect(() => {
    CHART.current.forEach(chart => {
      chartUtils.update(chart, {});
    });
  }, [visible]);
  
  return (
    <Card title={'报表'} headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} style={{ marginTop: 8 }}>
      <Row>
        {CHART.current.map(chart => 
          <Col span={12}>
            <div>
              <div ref={chart.domRef} style={{ width: '100%', height: 350 }}></div>
            </div>
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default Eb_WP()(Basic);
