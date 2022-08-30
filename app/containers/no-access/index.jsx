/**
 * NotFoundPage
 */
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import queryString from 'query-string';
import styles from './styles.less';
import history from 'utils/history';
import { logout } from 'services/logout';
import { t } from 'utils/i18n';

export default function Index({ location }) {

  const { callbackUrl = '/' } = queryString.parse(location.search);
  const [ count, setCount ] = useState(10);

  useEffect(() => {
    setTimeout(() => {
      if (count > 0) {
        setCount((c) => c - 1); 
      } else if (count === 0) {
        history.push('/');
      }
    }, 1000);
  }, [count]);

  const goHome = () => {
    history.push('/');
  };
  return (
    <div className={styles.noAccess}>
      <div className={styles.context}>
        <span className={styles.head}>{t('define.page.noAccess.title')}</span>
        <span className={styles.subhead}>{t('define.page.noAccess.subTitle')}</span>
        <Button onClick={() => goHome()} style={{ width: 349 }} className={styles.button} type={'primary'}>{t('define.action.backHome')}（{count}s）</Button>
        <a onClick={() => logout(callbackUrl)} className={styles.linkLogout}>{t('define.page.noAccess.reLogin')}</a>
      </div>
    </div>
  );
}
