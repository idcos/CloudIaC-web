import React, { useEffect } from 'react';
import { Form, Input, Button, notification } from 'antd';

import styles from './styles.less';

import { authAPI } from "../services/auth";


const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
};
const tailLayout = {
  wrapperCol: { span: 24 }
};

export default () => {
  const onFinish = async (values) => {
    try {
      const res = await authAPI.login(values);
      if (res.code != 200) {
        throw new Error(res.message);
      }
      localStorage.accessToken = res.result.token;
      const userInfoRes = await authAPI.info();
      if (userInfoRes.code != 200) {
        throw new Error(userInfoRes.message);
      }
      const userInfo = userInfoRes.result || {};
      const { devManual = 0 } = userInfo.newbieGuide || {};
      const updateUserInfoRes = await authAPI.updateSelf({ 
        newbieGuide: {
          devManual: devManual + 1
        }
      });
      if (updateUserInfoRes.code != 200) {
        throw new Error(updateUserInfoRes.message);
      }
      setUserConfig(updateUserInfoRes.result || {});
      redirectToIndex();
    } catch (e) {
      notification.error({
        message: e.message
      });
    }
  };

  const setUserConfig = (updateUserInfo) => {
    const { devManual = 0 } = updateUserInfo.newbieGuide || {};
    localStorage.newbieGuide_devManual = devManual <= 3;
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

      <div className='loginFormWrapper'>
        <div className='title'>IaC基础设施即代码平台</div>
        <Form
          {...layout}
          name='basic'
          className='loginForm'
          requiredMark='optional'
          onFinish={onFinish}
        >
          <div>
            <Form.Item
              className='format-form-item'
              label={
                <>
                  <span>邮箱</span>
                </>
              }
              name='email'
              rules={[
                { required: true, message: '请输入邮箱地址' }, 
                { type: 'email', message: '邮箱格式有误' }
              ]}
            >
              <Input placeholder='请输入邮箱地址' />
            </Form.Item>
          </div>
         

          <Form.Item
            className='format-form-item'
            label='密码'
            name='password'
            rules={[{ required: true, message: '请输入登录密码!' }]}
          >
            <Input.Password placeholder='请输入登录密码' />
          </Form.Item>

          <Form.Item {...tailLayout} style={{ paddingTop: 8 }}>
            <Button style={{ height: 36 }} block={true} type='primary' htmlType='submit'>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
     
    </div>
  );
};
