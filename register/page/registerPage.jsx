import React, { useEffect, useRef } from 'react';
import { Form, Input, Button, notification, Row, Col } from 'antd';
import queryString from 'query-string';
import { LangIcon } from 'components/iconfont';
import { t, getLanguage, setLanguage } from 'utils/i18n';
import styles from './styles.less';

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
};
const tailLayout = {
  wrapperCol: { span: 24 }
};

export default () => {

  const language = getLanguage();
  
  const onFinish = async (values) => {
    await console.log(values);
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
            className='registerForm'
            requiredMark='optional'
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
                rules={[
                  { required: true, message: t('define.registerPage.email.placeholder') }, 
                  { type: 'email', message: t('define.registerPage.email.formatError') }
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
              rules={[{ required: true, message: t('define.registerPage.password.placeholder') }]}
              getValueFromEvent={(e) => e.target.value.trim()}
            >
              <Input.Password placeholder={t('define.registerPage.password.placeholder')} />
            </Form.Item>

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
