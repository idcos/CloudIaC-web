import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Button, notification, Row, Col, Typography } from 'antd';
import queryString from 'query-string';
import { LangIcon } from 'components/iconfont';
import { t, getLanguage, setLanguage } from 'utils/i18n';
import styles from './styles.less';
import { registerAPI } from '../services/register';
const { Text } = Typography;

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
};
const tailLayout = {
  wrapperCol: { span: 24 }
};

export default () => {

  const language = getLanguage();
  const [form] = Form.useForm();
  const emailResend = useRef('');
  const onFinish = async (values) => {
    try {
      const register_res = await registerAPI.register(values);
      if (register_res.code != 200) {
        throw new Error(register_res.message);
      } else {
        notification.success({
          message: t('define.message.registerSuccess')
        });
        setTimeout(() => {
          redirectToLogin();
        }, 1500);
      }
    } catch (e) {
      notification.error({
        message: e.message
      });
    }
  };

  const handleCheckEmail = async (rules, value, callback) => {
    const email_res = await registerAPI.email({ email: value });
    if (email_res.code != 200) {
      callback(new Error(email_res.message_detail || email_res.message));
    }
    const { result: email_result = {} } = email_res;
    const { activeStatus, email } = email_result;
    if (email && activeStatus === 'active') {
      callback(new Error(t('define.registerPage.email.disabled')));
    } else if (email && activeStatus === 'inactive') {
      emailResend.current = email;
      callback(
        <div className={styles.email_exist}>
          <div>{t('define.registerPage.email.exist')}</div>
          <div className='send' onClick={handleResend}>{t('define.registerPage.email.resend')}</div>
        </div>
      );
    } else {
      callback();
    }
  };
  const handleResend = async () => {
    const res = await registerAPI.retry({ email: emailResend.current });
    if (res.code === 200) {
      notification.success({
        message: t('define.message.opSuccess')
      });
      setTimeout(() => {
        redirectToLogin();
      }, 1500);
    } 
  };

  const redirectToLogin = () => {
    const search = window.location.search;
    window.location.href = `/login${search}`;
  };

  return (
    <Row wrap={false} className={styles.register}>
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
        {language === 'zh' ? (
          <div className='change-language'>
            <LangIcon className='lang-icon' />
            <span>产品使用语言</span> 
            <span className='change-language-btn' onClick={() => setLanguage('en')}>EN?</span>
          </div>
        ) : (
          <div className='change-language'>
            <LangIcon className='lang-icon' />
            <span>View this page in</span>
            <span className='change-language-btn' onClick={() => setLanguage('zh')}>中文?</span>
          </div>
        )}
        <div className='registerFormWrapper'>
          <div className='title'>{t('define.registerPage.register')}</div>
          <Form
            {...layout}
            name='basic'
            form={form}
            className='registerForm'
            onFinish={onFinish}
          >
            <div>
              <Form.Item
                className='format-form-item'
                label={
                  <>
                    <span>{t('define.registerPage.email')}</span>
                  </>
                }
                name='email'
                validateTrigger={'onBlur'}
                rules={[
                  { 
                    validator: (rules, value, callback) => {
                      handleCheckEmail(rules, value, callback); 
                    } 
                  }
                ]}
                getValueFromEvent={(e) => e.target.value.trim()}
              >
                <Input placeholder={t('define.registerPage.email.placeholder')} />
              </Form.Item>
            </div>

            <div>
              <Form.Item
                className='format-form-item'
                label={
                  <>
                    <span>{t('define.registerPage.name')}</span>
                  </>
                }
                name='name'
                rules={[
                  { required: true, message: t('define.registerPage.name.placeholder') } 
                ]}
                getValueFromEvent={(e) => e.target.value.trim()}
              >
                <Input placeholder={t('define.registerPage.name.placeholder')} />
              </Form.Item>
            </div>
          
            <Form.Item
              className='format-form-item'
              label={t('define.registerPage.password')}
              name='password'
              validateTrigger={'onBlur'}
              rules={[
                { required: true, message: t('define.registerPage.password.placeholder') },
                { pattern: '^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,30}$', message: t('define.page.userSet.pwd.field.newPassword.rule') }
              ]}
              getValueFromEvent={(e) => e.target.value.trim()}
            >
              <Input.Password placeholder={t('define.registerPage.password.placeholder')} />
            </Form.Item>
            <div style={{ paddingTop: '30px' }}>
              <Text type='warning'>{t('define.page.userSet.pwd.field.newPassword.rule')}</Text>
            </div>
            

            <Form.Item {...tailLayout} style={{ paddingTop: 8, marginBottom: 0 }}>
              <Button style={{ height: 36 }} block={true} type='primary' htmlType='submit'>
                {t('define.registerPage.register')}
              </Button>
            </Form.Item>
          </Form>
          <div className='return-login' onClick={redirectToLogin}>{t('define.registerPage.returnToLogin')}</div>
        </div>
      </Col>
    </Row>
  );
};
