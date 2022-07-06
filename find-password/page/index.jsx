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
      notification.error({
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
      notification.error({
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

        <div className='action-container'>
          <Button onClick={redirectToLogin}>
            {t('define.action.cancel')}
          </Button>
          <Button type='primary' onClick={handleSendEmail}>
            {t('define.findPassword.find')}
          </Button>
        </div>
      </>);
    case "checkEmail":
      return <>
        <div>
          <div>{t('define.findPassword.sendEmail.message_1')}</div>
          <div>{t('define.findPassword.sendEmail.message_2')}</div>
        </div>
        <div className='action-container'>
          <Button onClick={redirectToLogin}>
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
            { required: true, message: t('define.registerPage.password.placeholder') },
            { pattern: `^(?![0-9]+$)(?![${specialWordResp}]+$)(?![a-zA-Z]+$)(?![^${specialWordResp}a-zA-Z]+$)(?![^0-9a-zA-Z]+$)(?![^${specialWordResp}0-9a-zA-Z]+$).{6,30}$`, message: t('define.page.userSet.pwd.field.newPassword.rule') }
          ]}
          getValueFromEvent={(e) => e.target.value.trim()}
          extra={t('define.page.userSet.pwd.field.newPassword.rule')}
        >
          <Input.Password placeholder={t('define.registerPage.password.placeholder')} />
        </Form.Item>
        <Form.Item
          className='format-form-item'
          label={t('define.page.userSet.pwd.field.reNewPassword')}
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
          <Input.Password autoComplete='new-password'/>
        </Form.Item>
        <Button type='primary' onClick={handleResetPassword}>
          {t('define.findPassword.find')}
        </Button>
      </>;
    default:
      break;
    }
  };

  return (
    <Row wrap={false} className={styles.login}>
      <Col span={14} className='left'>
        <div className='logo'>
          <img src='/assets/logo/iac-logo-light.svg' alt='logo' />
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
        {language === "zh" ? (
          <div className='change-language'>
            <LangIcon className='lang-icon' />
            <span>产品使用语言</span>
            <span
              className='change-language-btn'
              onClick={() => setLanguage("en")}
            >
              EN?
            </span>
          </div>
        ) : (
          <div className='change-language'>
            <LangIcon className='lang-icon' />
            <span>View this page in</span>
            <span
              className='change-language-btn'
              onClick={() => setLanguage("zh")}
            >
              中文?
            </span>
          </div>
        )}
        <div className='loginFormWrapper'>
          <div className='title'>{t("define.findPassword")}</div>
          <Form {...layout} name='basic' className='loginForm' form={form}>
            {renderFormItems()}
          </Form>
        </div>
      </Col>
    </Row>
  );
};
