import React, { useRef } from 'react';
import { Button } from 'antd';

import VariableForm from 'components/variable-form';
import PageHeaderPlus from 'components/pageHeaderPlus';
import LayoutPlus from 'components/common/layout/plus';

import styles from './styles.less';

export default () => {

  const varRef = useRef();

  const save = async () => {
    const varData = await varRef.current.validateForm();
  };

  return (
    <LayoutPlus
      extraHeader={<PageHeaderPlus
        title='变量'
        breadcrumb={true}
      />}
    >
      <div className={styles.variable}>
        <div className='idcos-card'>
          <VariableForm varRef={varRef} />
          <div className='btn-wrapper'>
            <Button type='primary' onClick={save}>保存</Button>
          </div>
        </div>
      </div>
      
    </LayoutPlus>
  );
};
