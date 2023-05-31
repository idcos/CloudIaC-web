import React, { useEffect, useState, useRef } from 'react';
import { notification, Row, Col } from 'antd';
import { matchPath } from 'react-router-dom';
import { LangIcon } from 'components/iconfont';
import { t, getLanguage, setLanguage } from 'utils/i18n';
import styles from './styles.less';
import { activationAPI } from '../services/activation';

const ActivationPage = () => {
  const language = getLanguage();
  const [activationState, setActivationState] = useState();
  const restSeconds = useRef(3);
  const [seconds, setSeconds] = useState(3);
  const timerIns = useRef(null);
  useEffect(async () => {
    const match =
      matchPath(window.location.pathname, ['/activation/:token']) || {};
    const { token } = match.params || {};
    const httpRes = await activationAPI.activation(
      {},
      { headers: { Authorization: token } },
    );
    if (httpRes.httpCode === 401) {
      setActivationState('expired');
    } else if (httpRes.httpCode === 200) {
      setActivationState('success');
      timerIns.current = setInterval(() => {
        if (restSeconds.current <= 0) {
          clearInterval(timerIns.current);
          redirectToLogin();
        } else {
          restSeconds.current = restSeconds.current - 1;
          setSeconds(restSeconds.current);
        }
      }, 1000);
    }
    return () => {
      timerIns.current && clearInterval(timerIns.current);
    };
  }, []);

  const handleResend = async () => {
    const match =
      matchPath(window.location.pathname, ['/activation/:token']) || {};
    const { token } = match.params || {};
    const httpRes = await activationAPI.retry({
      headers: { Authorization: token },
    });
    if (httpRes.httpCode === 200) {
      notification.success({
        message: t('define.message.opSuccess'),
      });
      setTimeout(() => {
        redirectToLogin();
      }, 1500);
    } else {
      notification.error({
        message: t('define.message.opFail'),
      });
    }
  };

  const redirectToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <Row wrap={false} className={styles.activation}>
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
        {language === 'zh' ? (
          <div className='change-language'>
            <LangIcon className='lang-icon' />
            <span>产品使用语言</span>
            <span
              className='change-language-btn'
              onClick={() => setLanguage('en')}
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
              onClick={() => setLanguage('zh')}
            >
              中文?
            </span>
          </div>
        )}
        <div className='activationFormWrapper'>
          <div className='title'>{t('define.activationPage.activation')}</div>
          <div className='main'>
            {activationState === '' && <></>}
            {activationState === 'expired' && (
              <div className='line'>
                <span>{t('define.activationPage.activation.expired')}</span>
                <span className='click' onClick={handleResend}>
                  {t('define.activationPage.activation.resend')}
                </span>
              </div>
            )}
            {activationState === 'success' && (
              <>
                <div className='line'>
                  <span>{t('define.activationPage.activation.success')}</span>
                  <span>{seconds}</span>
                  <span>
                    {t('define.activationPage.activation.autoRedirect')}
                  </span>
                </div>
                <div className='line'>
                  <span className='click' onClick={redirectToLogin}>
                    {t('define.activationPage.activation.clickJumpLogin')}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ActivationPage;
