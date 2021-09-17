import React from 'react';
import { Empty, Card } from "antd";
import DetectionList from './detection-list';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';

export default ({ requestFn }) => {

  // 合规结果查询
  const { 
    data: { 
      list, 
      task: { startAt } 
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
      headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} 
      bodyStyle={{ padding: 6 }} 
      type={'inner'} 
      title={
        <span style={{ display: 'flex' }}>
          合规状态 
          <div className={'UbuntuMonoOblique'}>
            {startAt && moment(startAt).format('YYYY-MM-DD HH:mm:ss') || '-'}
          </div>
        </span>
      }
    >
      {list.length == 0 ? (
        <Empty description='暂无策略检测则默认显示通过'/>
      ) : (
        <>
          {
            list.map(info => {
              return (<DetectionList info={info} />);
            })
          }
        </>
      )}
    </Card>
  );
}