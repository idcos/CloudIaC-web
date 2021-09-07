import React, { useState, useEffect, memo } from 'react';
import { Form, Drawer, notification, Select, Card } from "antd";

import cenvAPI from 'services/cenv';
import ComplianceCollapse from 'components/compliance-collapse';
import moment from 'moment';


const Index = ({ orgId, projectId, visible, toggleVisible, id }) => {

  const [ scanResults, setScanResults ] = useState([]);
  const [ scanTime, setScanTime ] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchResult();
  }, []);

  const fetchResult = async () => {
    try {
      const res = await cenvAPI.result({
        envId: id
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setScanResults(resetList(res.result.list.scanResults || []));
      setScanTime(res.result.list.scanTime || null);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const resetList = (list) => {
    if (list.length) {
      let typeList = [...new Set(list.map(d => ({ id: d.policyGroupId, name: d.policyGroupName })))];
      let ll = [];
      typeList.forEach(d => {
        let obj = {};
        let children = list.filter(t => t.policyGroupId === d.id).map(it => {
          return it || [];
        });
        obj.policyGroupName = d.name;
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
      // visible={visible}
      visible={true}
      onClose={toggleVisible}
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
        {
          scanResults.map(info => {
            return (<ComplianceCollapse info={info} />);
          })
        }
      </Card>
    </Drawer>
  );
};
export default memo(Index);