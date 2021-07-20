import React, { useState } from 'react';

import { Card, Form, Button, Input } from 'antd';

const layout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
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

  return <div style={{ width: 600, margin: '40px auto' }}>
    <Form
      {...layout}
      onFinish={onFinish}
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
        <Input.Password autoComplete='new-password'/>
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
        <Input.Password autoComplete='new-password'/>
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
        <Input.Password autoComplete='new-password'/>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type='primary' htmlType='submit' loading={submitLoading}>
          更改信息
        </Button>
      </Form.Item>
    </Form>
  </div>;
};

export default Pwd;
