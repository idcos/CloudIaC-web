import React, { useMemo } from 'react';
import { Spin } from 'antd';
import { CustomTag } from 'components/custom';
import { SCAN_DETAIL_DISABLE_STATUS } from 'constants/types';

export default ({ policyStatus, clickProps }) => {

  clickProps = SCAN_DETAIL_DISABLE_STATUS.includes(policyStatus) ? {} : clickProps;
  
  const Status = useMemo(() => {
    const map = {
      disable: (props) => <CustomTag type='default' text='未开启' {...props}/>,
      enable: (props) => <CustomTag type='default' text='未检测' {...props}/>,
      pending: (props) => <Spin {...props}/>,
      passed: (props) => <CustomTag type='success' text='合规' {...props} />,
      failed: (props) => <CustomTag type='error' text='不合规' {...props} />,
      violated: (props) => <CustomTag type='error' text='不合规' {...props} />
    };
    return map[policyStatus];
  });

  return (
    <>
      {Status && <Status {...clickProps} />}
    </>
  );
};