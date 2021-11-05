import React from 'react';
import { Empty, Card, Space, Tag } from "antd";
import moment from 'moment';
import classnames from 'classnames';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { POLICIES_DETECTION, POLICIES_DETECTION_COLOR_TAG } from 'constants/types';
import DetectionPolicyGroup from './detection-policy-group';
import FailLog from './fail-log';
import styles from './styles.less';

export default ({ requestFn, canFullHeight = false, failLogParams }) => {

  // 合规结果查询
  const { 
    data: { 
      list, 
      task: { id, orgId, projectId, startAt, policyStatus } 
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
    if (list.length) {
      let typeList = [...new Set(list.map(d => (d.policyGroupId)))];
      let ll = [];
      typeList.forEach(d => {
        let obj = {};
        let children = list.filter(t => t.policyGroupId === d).map(it => {
          return it || [];
        });
        obj.policyGroupName = (children.find(item => item.id === d.id) || {}).policyGroupName || '-';
        obj.children = children;
        ll.push(obj);
      });
      return ll || [];
    } else {
      return [];
    }
  };

  return (
    <Card 
      className={classnames('idcos-full-body-card', styles.detectionCard, {
        // 失败日志高度要固定
        [styles.fixedHeight]: policyStatus === 'failed', 
        // failLogNeedFullHeight为true则高度铺满
        [styles.fullFixedHeight]: canFullHeight
      })}
      headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} 
      bodyStyle={{ padding: 6 }} 
      type={'inner'} 
      title={
        <Space>
          <span>合规状态</span>
          {policyStatus && <Tag color={POLICIES_DETECTION_COLOR_TAG[policyStatus]}>{POLICIES_DETECTION[policyStatus]}</Tag>}
        </Space>
      }
      extra={
        <div className={'UbuntuMonoOblique'}>
          {startAt && moment(startAt).format('YYYY-MM-DD HH:mm:ss') || '-'}
        </div>
      }
    >
      {
        policyStatus === 'failed' ? (
          <FailLog id={id} orgId={orgId} projectId={projectId} failLogParams={failLogParams} />
        ) : (
          list.length == 0 ? (
            <Empty description='暂无策略检测则默认显示通过' image={Empty.PRESENTED_IMAGE_SIMPLE}/>
          ) : (
            <>
              {
                list.map(info => {
                  return (<DetectionPolicyGroup info={info} />);
                })
              }
            </>
          )
        )
      }
    </Card>
  );
}