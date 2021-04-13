import React, { useState } from 'react';

import { Card, Form, Button, Input } from 'antd';

import { sysAPI } from 'services/base';

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 10
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

  return <>
    <Card
      title={title}
    >
      <Form
        {...layout}
        layout='vertical'
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
            }
          ]}
          extra={'邮箱全局唯一，作为登录用户名'}
        >
          <Input placeholder='请输入邮箱' disabled={true}/>
        </Form.Item>
        <Form.Item
          label='手机号'
          name='phone'
          rules={[
            {
              message: '请选择'
            }
          ]}
        >
          <Input placeholder='请输入手机号'/>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' loading={submitLoading}>
            更改信息
          </Button>
        </Form.Item>
      </Form>
    </Card>
  </>;
};

export default Basic;
