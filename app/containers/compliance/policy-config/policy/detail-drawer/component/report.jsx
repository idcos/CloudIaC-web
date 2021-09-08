import React, { useEffect, useRef } from 'react';
import { Card, Row, Col } from 'antd';
import { chartUtils } from 'components/charts-cfg';

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

  useEffect(() => {
    resizeHelper.attach();
    return resizeHelper.remove();
  }, []);

  useEffect(() => {
    CHART.current.forEach(chart => {
      chartUtils.update(chart, {});
    });
  }, []);
  
  return (
    <Card title={'报表'} headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'}>
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
