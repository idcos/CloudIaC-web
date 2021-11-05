import React, { useState } from 'react';

import { Form, Button, Input } from 'antd';

const layout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  }
};

const Basic = ({ title, userInfo, updateUserInfo }) => {
  const [ submitLoading, setSubmitLoading ] = useState(false);

  const onFinish = (values) => {
    setSubmitLoading(true);
    updateUserInfo({
      payload: values,
      cb: () => {
        setSubmitLoading(false);
      }
    });
  };

  return <div style={{ width: 600, margin: '40px auto' }}>
    <Form
      {...layout}
      onFinish={onFinish}
      initialValues={{
        ...userInfo
      }}
    >
      <Form.Item
        name='name'
        label='姓名'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input placeholder='请输入姓名'/>
      </Form.Item>
      <Form.Item
        label='邮箱'
        name='email'
        rules={[
          {
            required: true,
            message: '请选择'
          },
          { type: 'email', message: '邮箱格式有误' }
        ]}
        extra={'邮箱全局唯一，作为登录用户名'}
      >
        <Input placeholder='请输入邮箱' disabled={true}/>
      </Form.Item>
      <Form.Item
        label='手机号'
        name='phone'
        rules={[{ pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' }]}
      >
        <Input placeholder='请输入手机号'/>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type='primary' htmlType='submit' loading={submitLoading}>
          更改信息
        </Button>
      </Form.Item>
    </Form>
  </div>;
};

export default Basic;
