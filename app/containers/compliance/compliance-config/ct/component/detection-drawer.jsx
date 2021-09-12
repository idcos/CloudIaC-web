import React from 'react';
import { Drawer, Empty, Card } from "antd";
import ctplAPI from 'services/ctpl';
import ComplianceCollapse from 'components/compliance-collapse';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';

export default ({  visible, onClose, id  }) => {

  // 合规结果查询
  const { 
    data: { policyStatus, scanResults, scanTime } = {
      policyStatus: '',
      scanResults: [],
      scanTime: null
    },
    cancel
  } = useRequest(
    () => requestWrapper(
      ctplAPI.result.bind(null, { tplId: id }),
      {
        formatDataFn: (res) => {
          const { list } = res.result || {};
          const { policyStatus, scanResults, scanTime } = list || {};
          return {
            policyStatus,
            scanResults: resetList(scanResults || []),
            scanTime: scanTime || null
          };
        }
      }
    ),
    {
      pollingInterval: 3000,
      pollingWhenHidden: false,
      onSuccess: (data) => {
        if (data.policyStatus !== '') {
          cancel();
        } 
      },
      onError: () => {
        cancel();
      }
    }
  );

  const resetList = (list) => {
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
    <Drawer
      title='检测详情'
      placement='right'
      visible={visible}
      onClose={onClose}
      width={800}
      bodyStyle={{
        padding: 0
      }}
    >
      <Card 
        headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} 
        bodyStyle={{ padding: 6 }} 
        type={'inner'} 
        title={<span style={{ display: 'flex' }}>合规状态 <div className={'UbuntuMonoOblique'}>{scanTime && moment(scanTime).format('YYYY-MM-DD HH:mm:ss') || '-'}</div></span>}
      >
        {scanResults.length == 0 ? (
          <Empty />
        ) : (
          <>{
            scanResults.map(info => {
              return (<ComplianceCollapse info={info} />);
            })
          }
          </>
        )}
      </Card>
    </Drawer>
  );
};