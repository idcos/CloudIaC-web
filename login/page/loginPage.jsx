import React, { useEffect, useRef } from 'react';
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

  const { callbackUrl, redirectToRegistry } = queryString.parse(window.location.search);
  const inputRef = useRef();
  
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
      if (redirectToRegistry === 'y') {
        redirectToRegistryPage();
      } else {
        redirectToPage();
      }
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
      if (redirectToRegistry === 'y') {
        redirectToRegistryPage();
      } else {
        redirectToIndex();
      }
    }
  }, []);

  const redirectToRegistryPage = async () => {
    const { url, query } = queryString.parseUrl(decodeURIComponent(callbackUrl));
    const res = await authAPI.getSsoToken();
    const { token } = res && res.result || {};
    const redirectToUrl = queryString.stringifyUrl({
      url,
      query: {
        ...query,
        accessToken: token
      }
    });
    window.location.href = redirectToUrl;
  };

  const redirectToPage = () => {
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
            <div>???????????????????????????</div>
          </div>
          <div className='describe'>?????????????????????</div>
        </div>
        <div className='foot'>Copyright ?? 2022 ??????????????????????????????</div>
      </Col>
      <Col span={10} className='right'>
        <div className='loginFormWrapper'>
          <div className='title'>??????</div>
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
                    <span>??????</span>
                  </>
                }
                name='email'
                rules={[
                  { required: true, message: '?????????????????????' }, 
                  { type: 'email', message: '??????????????????' }
                ]}
                getValueFromEvent={(e) => e.target.value.replace(/(^\s*)|(\s*$)/g, '')}
              >
                <Input placeholder='?????????????????????' />
              </Form.Item>
            </div>
          

            <Form.Item
              className='format-form-item'
              label='??????'
              name='password'
              rules={[{ required: true, message: '?????????????????????!' }]}
              getValueFromEvent={(e) => e.target.value.replace(/(^\s*)|(\s*$)/g, '')}
            >
              <Input.Password placeholder='?????????????????????' />
            </Form.Item>

            <Form.Item {...tailLayout} style={{ paddingTop: 8 }}>
              <Button style={{ height: 36 }} block={true} type='primary' htmlType='submit'>
                ??????
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
};
