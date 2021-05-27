import React, { useEffect } from 'react';
import { Form, Input, Button, notification } from 'antd';

import MarkdownDoc from '../components/markdownDoc';

import styles from './styles.less';


export default () => {

  return (
    <div className={styles.developerManual}>
      <MarkdownDoc/>
    </div>
  );
};
