import React from 'react';
import { Empty, Space, Row, Col } from "antd";
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import PolicyStatus from 'components/policy-status';
import DetectionPolicyGroup from './detection-policy-group';
import FailLog from './fail-log';
import styles from './styles.less';

export default ({ requestFn, failLogParams }) => {

  // 合规结果查询
  const { 
    data: { 
      groups, 
      policyStatus,
      task: { id, orgId, projectId, startAt } 
    } = {
      groups: [],
      task: {}
    },
    cancel
  } = useRequest(
    () => requestWrapper(
      requestFn
    ),
    {
      pollingInterval: 3000,
      pollingWhenHidden: false,
      formatResult: (data) => {
        const { groups, task, policyStatus } = data || {};
        return {
          groups: groups || [],
          task: task || {},
          policyStatus
        };
      },
      onSuccess: (data) => {
        if (data.policyStatus !== 'pending') {
          cancel();
        } 
      },
      onError: () => {
        cancel();
      }
    }
  );

  return (
    <div className={styles.detectionDetail}>
      <Row className='detection-header' wrap={false} justify='space-between' align='middle'>
        <Col>
          <Space>
            <span>合规状态</span>
            <PolicyStatus policyStatus={policyStatus}/>
            {/* <Button>立即检测</Button> */}
          </Space>
        </Col>
        <Col>
          <div className={'UbuntuMonoOblique'}>
            {startAt && moment(startAt).format('YYYY-MM-DD HH:mm:ss') || '-'}
          </div>
        </Col>
      </Row>
      <div className='detection-body'>
        {
          policyStatus === 'failed' ? (
            <FailLog id={id} orgId={orgId} projectId={projectId} failLogParams={failLogParams} />
          ) : (
            groups.length == 0 ? (
              <Empty description='暂无策略检测则默认显示通过' image={Empty.PRESENTED_IMAGE_SIMPLE}/>
            ) : (
              <Space direction='vertical' size={24} style={{ width: '100%' }}>
                {
                  groups.map(info => {
                    return (<DetectionPolicyGroup info={info} />);
                  })
                }
              </Space>
            )
          )
        }
      </div>
    </div>
  );
};