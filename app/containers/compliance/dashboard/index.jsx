import React, { useState, useEffect } from 'react';
import { Row, Col, Input, notification, Badge, Card, Divider, Popconfirm } from 'antd';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { useSearchFormAndTable } from 'utils/hooks';
import policiesAPI from 'services/policies';
import { POLICIES_DETECTION, POLICIES_DETECTION_COLOR_COLLAPSE } from 'constants/types';
import styles from './style.less';
import Active from './component/active';
import Unsolved from './component/unsolved';
import Policy from './component/policy';
import PolicyGroup from './component/policy-group';


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
      let resss = {
        "code": 200,
        "message": "ok",
        "message_detail": "ok",
        "result": {
          "activePolicy": {
            "changes": -0.5,
            "last": 40,
            "summary": [
              {
                "name": "passed",
                "value": 100
              },
              {
                "name": "suppressed",
                "value": 6
              },
              {
                "name": "failed",
                "value": 20
              },
              {
                "name": "violated",
                "value": 20
              }
            ],
            "total": 20
          },
          "policyGroupViolated": [
            {
              "name": "ECS未启用监控",
              "value": 10
            },
            {
              "name": "VPC没有安全组",
              "value": 6
            },
            {
              "name": "IAM未启用",
              "value": 4
            },
            {
              "name": "密码登录",
              "value": 2
            },
            {
              "name": "开放8339端口",
              "value": 1
            }
          ],
          "policyViolated": [
            {
              "name": "ECS未启用监控",
              "value": 10
            },
            {
              "name": "VPC没有安全组",
              "value": 6
            },
            {
              "name": "IAM未启用",
              "value": 4
            },
            {
              "name": "密码登录",
              "value": 2
            },
            {
              "name": "开放8339端口",
              "value": 1
            }
          ],
          "unresolvedPolicy": {
            "summary": [
              {
                "name": "high",
                "value": 2
              },
              {
                "name": "medium",
                "value": 6
              },
              {
                "name": "low",
                "value": 4
              }
            ],
            "changes": 1,
            "last": 6,
            "total": 12
          }
        }
      };
      setSummaryData(resss.result);
    } catch (e) {
      notification.error({
        message: '操作失败',
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
        <Policy summaryData={summaryData.policyViolated}/>
      </Col>
      <Col span={12} style={{ paddingLeft: 12 }}>
        <PolicyGroup summaryData={summaryData.policyGroupViolated}/>
      </Col>
    </Row>
  </div>;
};

export default PolicyGroupList;
