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

const Pwd = ({ title, userInfo, updateUserInfo }) => {
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
          oldPassword: userInfo.initPass
        }}
      >
        <Form.Item
          label='原密码'
          name='oldPassword'
          rules={[
            {
              required: true,
              message: '请输入'
            }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label='新密码'
          name='newPassword'
          rules={[
            {
              required: true,
              message: '请输入'
            }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label='确认新密码'
          name='reNewPassword'
          dependencies={['newPassword']}
          hasFeedback={true}
          rules={[
            {
              required: true,
              message: '请输入'
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入不一致!'));
              }
            })
          ]}
        >
          <Input.Password />
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

export default Pwd;
