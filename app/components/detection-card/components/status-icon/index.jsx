import React, { useMemo } from 'react';
import classNames from 'classnames';
import { InfoCircleFilled, CheckCircleFilled, MinusCircleFilled } from '@ant-design/icons';
import { ShieldIcon } from 'components/iconfont';
import styles from './styles.less';

export default ({ type = 'mix', hasWrapper = false }) => {

  const cfg = useMemo(() => {
    switch (type) {
    case 'passed': 
      return {
        icon: <CheckCircleFilled style={{ color: '#108548' }} />,
        wrapperBgColor: '#C3E6CD'
      };
    case 'failed': 
    case 'violated': 
      return {
        icon: <MinusCircleFilled style={{ color: '#DD2E12' }} />,
        wrapperBgColor: '#FDD4CD'
      };
    case 'suppressed':
      return {
        icon: <ShieldIcon style={{ color: '#868686' }} />,
        wrapperBgColor: '#DADBDA'
      };
    default: 
      return {
        icon: <InfoCircleFilled style={{ color: '#AB6100' }} />,
        wrapperBgColor: '#F5D9A8'
      };
    }
 
  });

  return (
    <div 
      className={classNames(styles.iconWrapper, { hasWrapper })}
      style={{ 
        backgroundColor: hasWrapper ? cfg.wrapperBgColor : 'inherit'
      }}
    >
      {cfg.icon}
    </div>
  );
};