import React, { useEffect } from 'react';
import { Form, Input, Button, notification, Row, Col } from 'antd';
import queryString from 'query-string';
import { authAPI } from "../services/auth";
import styles from './styles.less';


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
      redirectToPage();
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

  const redirectToPage = () => {
    const { callbackUrl } = queryString.parse(window.location.search);
    if (callbackUrl) {
      window.location.href = decodeURIComponent(callbackUrl);
    } else {
      redirectToIndex();
    }
  };

  const redirectToIndex = () => {
    window.location.href = '/';
  };

  return (
    <Row wrap={false} className={styles.login}>
      <Col span={14} className='left'>
        <div className='logo'>
          <img src='/assets/logo/iac-logo-light.svg' alt='logo'/>
        </div>
        <div className='content'>
          <div className='title'>
            <div>CloudlaC</div>
            <div>基础设施即代码平台</div>
          </div>
          <div className='describe'>引领云原生运维</div>
        </div>
        <div className='foot'>Copyright © 2022 杭州云霁科技有限公司</div>
      </Col>
      <Col span={10} className='right'>
        <div className='loginFormWrapper'>
          <div className='title'>登录</div>
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
      </Col>
    </Row>
  );
};
