import React from 'react';
import { Empty, Space, Row, Col, Button } from "antd";
import moment from 'moment';
import noop from 'lodash/noop';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import PolicyStatus from 'components/policy-status';
import { LoadingIcon } from 'components/lottie-icon';
import { SCAN_DISABLE_STATUS } from 'constants/types';
import DetectionPolicyGroup from './detection-policy-group';
import FailLog from './fail-log';
import styles from './styles.less';

export default ({ 
  targetId, 
  disableEmptyDescription, 
  failLogParams,
  targetType,
  requestFn = noop, 
  runScanRequestFn = noop,
  onSuccessCallback = noop
}) => {

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
    refresh,
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
        onSuccessCallback();
      },
      onError: () => {
        cancel();
      }
    }
  );

  // 合规检测
  const {
    run: runScan
  } = useRequest(
    () => requestWrapper(
      runScanRequestFn
    ), {
      manual: true,
      onSuccess: () => {
        refresh();
      }
    }
  );

  if (policyStatus === 'pending') {
    return (
      <Space style={{ width: '100%', paddingTop: 80 }} direction='vertical' size='middle' align='center'>
        <LoadingIcon size={60} />
        <span style={{ color: 'rgba(0, 0, 0, 0.86)' }}>检测中</span>
      </Space>
    );
  } else {
    return (
      <div className={styles.detectionDetail}>
        <Row className='detection-header' wrap={false} justify='space-between' align='middle'>
          <Col>
            <Space>
              <span>合规状态</span>
              <PolicyStatus policyStatus={policyStatus} style={{ margin: 0 }} />
              {policyStatus === 'disable' ? disableEmptyDescription : (
                <Button 
                  disabled={SCAN_DISABLE_STATUS.includes(policyStatus)}
                  onClick={runScan}
                >
                  立即检测
                </Button>
              )}
            </Space>
          </Col>
          <Col>
            <div className={'UbuntuMonoOblique'}>
              {startAt && moment(startAt).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          </Col>
        </Row>
        <div className='detection-body'>
          {
            policyStatus === 'failed' ? (
              <FailLog id={id} orgId={orgId} projectId={projectId} failLogParams={failLogParams} />
            ) : (
              groups.length == 0 ? (
                <Empty 
                  description={policyStatus === 'disable' ? (
                    '未开启合规检测'
                  ) : '暂无策略检测则默认显示通过'} 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <Space direction='vertical' size={24} style={{ width: '100%' }}>
                  {
                    groups.map(info => {
                      return (<DetectionPolicyGroup info={info} refresh={refresh} targetType={targetType} targetId={targetId} />);
                    })
                  }
                </Space>
              )
            )
          }
        </div>
      </div>
    );
  }
};