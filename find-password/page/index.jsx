import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Button, notification, Row, Col, Space } from "antd";
import queryString from "query-string";
import { matchPath } from 'react-router-dom';
import { LangIcon } from "components/iconfont";
import { t, getLanguage, setLanguage } from "utils/i18n";
import { useRequest } from "ahooks";
import { requestWrapper } from "utils/request";
import { authAPI } from "../services/auth";
import styles from "./styles.less";

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
};
const tailLayout = {
  wrapperCol: { span: 24 }
};
const specialWordResp = '\!\"#$%&\'\(\)*+\,-./:;<=>?@\[\\\]\^_`\{\|\}~';

export default () => {
  const language = getLanguage();
  const { callbackUrl, redirectToExchange } = queryString.parse(
    window.location.search
  );
  const [form] = Form.useForm();
  const [ currentStep, setCurrentStep ] = useState("sendEmail");
  const [ token, setToken ] = useState();
  const [ showErrorMessage, setShowErrorMessage ] = useState(false);

  useRequest(() => requestWrapper(authAPI.getSysConfigSwitches.bind(null)), {
    onSuccess: (data) => {
      if (!(data.enableRegister || false) && currentStep === 'sendEmail') {
        redirectToLogin();
      }
    }
  });

  useEffect(() => {
    const match = matchPath(window.location.pathname, ['/find-password/:token']) || {};
    const { token } = match.params || {};
    if (token) {
      setToken(token);
      setCurrentStep('resetPassword');
    }
  }, [window.location.pathname]);

  const redirectToLogin = () => {
    const search = window.location.search;
    window.location.href = `/login${search}`;
  };

  const handleSendEmail = async () => {
    try {
      const value = await form.validateFields();
      const res = await authAPI.sendEmail(value);
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setCurrentStep('checkEmail');
    } catch (err) {
      err.message && notification.error({
        message: err.message
      });
    }
  };

  const handleResetPassword = async () => {
    try {
      const value = await form.validateFields();
      const res = await authAPI.reset({ password: value.newPassword, token });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      notification.success({ message: t('define.message.opSuccess') });
      setTimeout(() => redirectToLogin(), 500);
    } catch (err) {
      err.message && notification.error({
        message: err.message
      });
    }
  };

  const setUserConfig = (updateUserInfo) => {
    const { devManual = 0 } = updateUserInfo.newbieGuide || {};
    localStorage.newbieGuide_devManual = devManual <= 3;
  };

  useEffect(() => {
    if (localStorage.accessToken) {
      if (redirectToExchange === "y") {
        redirectToExchangePage();
      } else {
        redirectToIndex();
      }
    }
  }, []);

  const handleCheckEmail = async (rules, value) => {
    if (value === undefined) {
      return Promise.reject(new Error(t("define.registerPage.email.disabled")));
    }
    const email_res = await authAPI.email({ email: value });
    if (email_res.code != 200) {
      return Promise.reject(new Error(email_res.message_detail || email_res.message));
    }
    const { result: email_result = {} } = email_res;
    const { activeStatus, email } = email_result;
    if (email && activeStatus !== "active") {
      return Promise.reject(new Error(t("define.registerPage.email.disabled")));
    } else {
      return Promise.resolve();
    }
  };

  const handleValidatorNewPassword = async (rules, value) => {
    const reg = new RegExp(`^(?![0-9]+$)(?![${specialWordResp}]+$)(?![a-zA-Z]+$)(?![^${specialWordResp}a-zA-Z]+$)(?![^0-9a-zA-Z]+$)(?![^${specialWordResp}0-9a-zA-Z]+$).{6,30}$`, 'g');
    if (value == undefined || value === '') {
      setShowErrorMessage(true);
      return Promise.reject(new Error(t('define.registerPage.password.placeholder')));
    } else if (!reg.test(value)) {
      setShowErrorMessage(true);
      return Promise.reject(new Error(t('define.page.userSet.pwd.field.newPassword.rule')));
    } else {
      setShowErrorMessage(false);
      return Promise.resolve();
    }
  };

  const redirectToExchangePage = async () => {
    const { url, query } = queryString.parseUrl(
      decodeURIComponent(callbackUrl)
    );
    const res = await authAPI.getSsoToken();
    const { token } = (res && res.result) || {};
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
    window.location.href = "/";
  };

  const renderFormItems = () => {
    switch (currentStep) {
    case "sendEmail":
      return (<>
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
                validator: (rules, value) => {
                  return handleCheckEmail(rules, value);
                }
              }
            ]}
            getValueFromEvent={(e) => e.target.value.trim()}
          >
            <Input placeholder={t('define.registerPage.email.placeholder')} />
          </Form.Item>
        </div>

        <div className='bottom-actions-container'>
          <Button onClick={redirectToLogin} style={{ width: 140, height: 36 }}>
            {t('define.action.cancel')}
          </Button>
          <Button type='primary' onClick={handleSendEmail} style={{ width: 140, height: 36 }}>
            {t('define.findPassword.find')}
          </Button>
        </div>
      </>);
    case "checkEmail":
      return <>
        <div className='message-container'>
          <div>{t('define.findPassword.sendEmail.message_1')}</div>
          <div>{t('define.findPassword.sendEmail.message_2')}</div>
        </div>
        <div className='bottom-actions-container'>
          <Button onClick={redirectToLogin} style={{ width: '100%' }}>
            {t('define.action.cancel')}
          </Button>
        </div>
      </>;
    case "resetPassword":
      return <>
        <Form.Item
          className='format-form-item'
          label={t('define.page.userSet.pwd.field.newPassword')}
          name='newPassword'
          validateTrigger={'onBlur'}
          rules={[
            {
              validator: (rules, value) => {
                return handleValidatorNewPassword(rules, value);
              }
            }
          ]}
          getValueFromEvent={(e) => e.target.value.trim()}
          extra={!showErrorMessage && t('define.page.userSet.pwd.field.newPassword.rule')}
          style={{ marginBottom: 48 }}
        >
          <Input.Password placeholder={t('define.registerPage.password.placeholder')} />
        </Form.Item>
        <Form.Item
          className='format-form-item'
          label={t('define.findPassword.resetPassword.confirmPassword')}
          name='reNewPassword'
          dependencies={['newPassword']}
          hasFeedback={true}
          rules={[
            {
              required: true,
              message: t('define.form.input.placeholder')
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('define.page.userSet.pwd.field.reNewPassword.error.noSame')));
              }
            })
          ]}
        >
          <Input.Password placeholder={t('define.registerPage.password.placeholder')} autoComplete='new-password'/>
        </Form.Item>
        <div className='bottom-actions-container'>
          <Button type='primary' onClick={handleResetPassword} style={{ width: '100%' }}>
            {t('define.action.confirm')}
          </Button>
        </div>
      </>;
    default:
      break;
    }
  };

  return (
    <div className={styles.login}>
      <div className='center-container'>
        <div className='center-card'>
          <div className='header-container'>
            <div className='logo'>
              <img src='/assets/logo/iac-logo-light.svg' alt='logo'/>
            </div>
          </div>
          <div className='loginFormWrapper'>
            {currentStep !== 'resetPassword' && <div className='title'>{t("define.findPassword")}</div>}
            <Form {...layout} name='basic' className='loginForm' form={form}>
              {renderFormItems()}
            </Form>
          </div>
        </div>
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
      </div>
      <div className='foot'>Copyright © 2022 杭州云霁科技有限公司</div>
    </div>
  );
};
