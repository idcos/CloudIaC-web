import React, { useState, useEffect } from 'react';
import { Row, Col, notification } from 'antd';
import policiesAPI from 'services/policies';
import styles from './style.less';
import Active from './component/active';
import Unsolved from './component/unsolved';
import Policy from './component/policy';
import PolicyGroup from './component/policy-group';
import { t } from 'utils/i18n';

const PolicyGroupList = () => {
  const [ summaryData, setSummaryData ] = useState({});

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async(value, record) => {
    try { 
      const res = await policiesAPI.policiesSummary();
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setSummaryData(res.result);
    } catch (e) {
      notification.error({
        message: t('define.message.getFail'),
        description: e.message
      });
    }
  };

  return <div className={styles.dashboard}>
    <Row>
      <Col span={16} style={{ paddingRight: 24 }}>
        <Active summaryData={summaryData.activePolicy}/>
      </Col>
      <Col span={8}>
        <Unsolved summaryData={summaryData.unresolvedPolicy}/>
      </Col>
    </Row>
    <Row style={{ paddingTop: 24 }}>
      <Col span={12} style={{ paddingRight: 12 }}>
        <Policy summaryData={summaryData.policyViolated || []}/>
      </Col>
      <Col span={12} style={{ paddingLeft: 12 }}>
        <PolicyGroup summaryData={summaryData.policyGroupViolated || []}/>
      </Col>
    </Row>
  </div>;
};

export default PolicyGroupList;
