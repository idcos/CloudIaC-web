import React from 'react';
import { Empty, Space, Row, Col, Button } from "antd";
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
      list, 
      task: { id, orgId, status, projectId, startAt, policyStatus } 
    } = {
      list: [],
      task: {}
    },
    cancel
  } = useRequest(
    () => requestWrapper(
      requestFn,
      {
        formatDataFn: (res) => {
          const { list, task } = res.result || {};
          return {
            list: formatList(list || []),
            task: task || {}
          };
        }
      }
    ),
    {
      pollingInterval: 3000,
      pollingWhenHidden: false,
      onSuccess: (data) => {
        if (data.task.policyStatus !== 'pending') {
          cancel();
        } 
      },
      onError: () => {
        cancel();
      }
    }
  );

  const formatList = (list) => {
    list = list || [];
    const policyGroupIdList = [...new Set(list.map(d => (d.policyGroupId)))];
    return policyGroupIdList.map(policyGroupId => {
      const children = list.filter(it => it.policyGroupId === policyGroupId);
      const failedList = [ 'violated', 'failed' ];
      let status = failedList.includes(children[0].status) ? 'failed' : children[0].status;
      for (let index = 1; index < children.length; index++) {
        if (status !== 'failed') {
          // 非失败状态如有不同状态则为混合状态
          if (status !== children[index].status) {
            status = '';
            break;
          }
        } else {
          // 失败状态如有非失败状态列表的状态则为混合状态
          if (!failedList.includes(children[index].status)) {
            status = '';
            break;
          }
        }
      }
      const { policyGroupName } = children[0];
      return {
        children,
        policyGroupName,
        status // passed合规 suppressed屏蔽 failed不合规（'violated', 'failed'统一） 
      };
    });
  };

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
          status === 'failed' ? (
            <FailLog id={id} orgId={orgId} projectId={projectId} failLogParams={failLogParams} />
          ) : (
            list.length == 0 ? (
              <Empty description='暂无策略检测则默认显示通过' image={Empty.PRESENTED_IMAGE_SIMPLE}/>
            ) : (
              <Space direction='vertical' size={24} style={{ width: '100%' }}>
                {
                  list.map(info => {
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