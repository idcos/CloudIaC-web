import React, { useState, useEffect } from 'react';
import { Space, Radio, Select, Form, Input, Button, Empty, notification, Row, Col } from "antd";

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 }
};

export default ({ stepHelper, ctData, type }) => {

  const [form] = Form.useForm();

  const onFinish = (values) => {
    stepHelper.updateData({
      type: 'basic', 
      data: values
    });
    stepHelper.next();
  };

  useEffect(() => {
    if (ctData[type]) {
      form.setFieldsValue(ctData[type]);
    }
  }, [ ctData, type ]);

  return <div className='form-wrapper' style={{ width: 600 }}>
    <Form
      form={form}
      {...FL}
      onFinish={onFinish}
    >
      <Form.Item
        label='模板名称'
        name='name'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input placeholder='请输入模板名称' />
      </Form.Item>
      <Form.Item
        label='模板描述'
        name='description'
      >
        <Input.TextArea placeholder='请输入模板描述' />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 5, span: 14 }}>
        <Space size={24}>
          <Button type='primary' htmlType={'submit'}>下一步</Button>
        </Space>
      </Form.Item>
    </Form>
  </div>;
};
