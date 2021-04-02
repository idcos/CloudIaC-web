import React, { useEffect } from 'react';
import { Form, Input, Button, notification } from 'antd';

import styles from './styles.less';

import { authAPI } from "../services/auth";


const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 20 }
};

export default () => {
  const onFinish = async (values) => {
    try {
      const res = await authAPI.login(values);
      if (res.code != 200) {
        throw new Error(res.message);
      }
      localStorage.accessToken = res.result.token;
      redirectToIndex();
    } catch (e) {
      notification.error({
        message: e.message
      });
    }
  };

  useEffect(() => {
    if (localStorage.accessToken) {
      redirectToIndex();
    }
  }, []);

  const redirectToIndex = () => {
    window.location.pathname = '/';
  };

  return (
    <div className={styles.login}>
      <Form
        {...layout}
        name='basic'
        className='loginForm'
        onFinish={onFinish}
      >
        <Form.Item
          label='邮箱'
          name='email'
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='密码'
          name='password'
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type='primary' htmlType='submit'>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
