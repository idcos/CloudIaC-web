/**
 * NotFoundPage
 */
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import queryString from 'query-string';
import styles from './styles.less';
import history from 'utils/history';
import { logout } from 'services/logout';

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
        <span className={styles.head}>您暂无权限访问页面</span>
        <span className={styles.subhead}>对不起，您目前无权限访问页面，请联系管理</span>
        <Button onClick={() => goHome()} style={{ width: 349 }} className={styles.button} type={'primary'}>返回首页（{count}s）</Button>
        <a onClick={() => logout(callbackUrl)} className={styles.linkLogout}>选择重新登录</a>
      </div>
    </div>
  );
}
