import React, { useState, useEffect, memo } from 'react';
import { Form, Drawer, notification, Select, Card } from "antd";

import projectAPI from 'services/project';
import ComplianceCollapse from 'components/compliance-collapse';
import moment from 'moment';

const Index = ({ orgId, projectId, visible, toggleVisible, operation }) => {

  const [ userOptions, setUserOptions ] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserOptions();
  }, []);

  const fetchUserOptions = async () => {
    try {
      const res = await projectAPI.getUserOptions({
        orgId, projectId
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setUserOptions(res.result || []);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const onOk = async () => {
    const values = await form.validateFields();
    operation({
      doWhat: 'add',
      payload: {
        orgId,
        type: 'api',
        ...values
      }
    }, (hasError) => {
      !hasError && toggleVisible();
    });
  };

  return (
    <Drawer
      title='检测详情'
      placement='right'
      visible={visible}
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
        title={<span style={{ display: 'flex' }}>合规状态 <div className={'UbuntuMonoOblique'}>{moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}</div></span>}
      >
        <ComplianceCollapse />
      </Card>
    </Drawer>
  );
};
export default memo(Index);