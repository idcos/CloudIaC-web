/**
 * 一个内置登录页，
 * 应该是要做多入口的。而不是在此处实现
 * 但考虑到后面又要接入uc，so...
 */
import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import history from 'utils/history';

import styles from './styles.less';


const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 20 }
};

export default () => {

  const onFinish = (values) => {
    console.log('Success:', values);
    localStorage.accessToken = '123';
    redirectToIndex();
  };

  useEffect(() => {
    if (localStorage.accessToken) {
      redirectToIndex();
    }
  }, []);

  const redirectToIndex = () => {
    history.push('/');
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
          label='用户名'
          name='username'
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
