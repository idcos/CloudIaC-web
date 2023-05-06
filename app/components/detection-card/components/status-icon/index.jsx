import React, { useMemo } from 'react';
import classNames from 'classnames';
import { SuccessIcon, ErrorIcon, ErrorFieldIcon } from 'components/iconfont';
import { ShieldIcon } from 'components/iconfont';
import styles from './styles.less';

const StatusIcon = ({ type = '', hasWrapper = false }) => {
  const cfg = useMemo(() => {
    switch (type) {
      case 'passed':
        return {
          icon: <SuccessIcon style={{ color: '#108548' }} />,
          wrapperBgColor: '#C3E6CD',
        };
      case 'failed':
        return {
          icon: <ErrorFieldIcon style={{ color: '#DD2E12' }} />,
          wrapperBgColor: '#FB9E03',
        };
      case 'violated':
        return {
          icon: <ErrorIcon style={{ color: '#DD2E12' }} />,
          wrapperBgColor: '#FDD4CD',
        };
      case 'suppressed':
        return {
          icon: <ShieldIcon style={{ color: '#868686' }} />,
          wrapperBgColor: '#DADBDA',
        };
      default:
        return {};
    }
  });

  return (
    <div
      className={classNames(styles.iconWrapper, { hasWrapper })}
      style={{
        backgroundColor: hasWrapper ? cfg.wrapperBgColor : 'inherit',
      }}
    >
      {cfg.icon}
    </div>
  );
};

export default StatusIcon;
