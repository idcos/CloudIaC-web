import React, { useState } from 'react';
import { Card, Button, Space, Table, Input, Alert, Drawer, Form } from 'antd';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 10 }
};

export default ({ visible, onClose }) => {

  const [form] = Form.useForm();

  const columns = [
    {
      dataIndex: '',
      title: '云模板名称'
    },
    {
      dataIndex: '',
      title: '环境名称'
    }
  ];

  return (
    <Drawer
      title='屏蔽'
      visible={visible}
      onClose={onClose}
      width={700}
      bodyStyle={{ padding: 16 }}
      footerStyle={{ textAlign: 'right' }}
      footer={
        <Space>
          <Button>取消</Button>
          <Button type='primary'>保存</Button>
        </Space>
      }
    >
      <Alert 
        message='提示：策略禁用后所有应用该策略的环境和云模板在执行检测时都将忽略该条策略'
        type='error'
        showIcon={true}
        closable={true}
      />
      <Form 
        form={form} 
        {...FL}
        style={{ margin: '28px 0' }}
      >
        <Form.Item
          label='屏蔽说明'
          name='a'
          rules={[
            {
              required: true,
              message: '请输入'
            }
          ]}
        >
          <Input placeholder={'请填写屏蔽说明'}/>
        </Form.Item>
      </Form>
      <Table 
        dataSource={[]}
        columns={columns}
      />
    </Drawer>
  );
};