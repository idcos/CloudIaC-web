import React, { useState, useEffect } from 'react';
import { Form, Drawer, notification, Card } from "antd";
import userAPI from 'services/user';

import ComplianceCollapse from 'components/compliance-collapse';

export default ({ orgId, operation, visible, toggleVisible }) => {

  const [ selectedRowKeys, setSelectedRowKeys ] = useState([]),
    [ query, setQuery ] = useState({
      pageNo: 1,
      pageSize: 10
    });

  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserList();
  }, [query]);

  const fetchUserList = async () => {
    try {
      const res = await userAPI.list({
        q: query.name,
        pageSize: query.pageSize,
        currentPage: query.pageNo,
        orgId
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
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
        userIds: selectedRowKeys,
        ...values
      }
    }, toggleVisible);
  };
  
  return <>
    <Drawer
      title='策略名称'
      visible={visible}
      onClose={toggleVisible}
      bodyStyle={{ padding: 0 }}
      width={1000}
      onOk={onOk}
    >
      <Card title={'合规检测'} bodyStyle={{ padding: 5 }} headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} >
        <ComplianceCollapse/>
      </Card>
    </Drawer>
  </>;
};
