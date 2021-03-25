import React from 'react';

import { Form, Button, InputNumber, Select } from 'antd';

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 20
  }
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16
  }
};

const Params = () => {
  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return <div className='contentBody'>
    <Form
      {...layout}
      layout='vertical'
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label='并发作业数'
        name='1'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <InputNumber/> 个
      </Form.Item>
      <Form.Item
        label='日志保存周期'
        name='2'
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
      >
        <Select
          style={{ width: 240 }}
        ></Select>
      </Form.Item>
      <Form.Item>
        <Button type='primary' htmlType='submit'>
          更改信息
        </Button>
      </Form.Item>
    </Form>
  </div>;
};

export default Params;
