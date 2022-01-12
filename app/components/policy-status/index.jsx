import React from 'react';
import { Spin } from 'antd';
import { CustomTag } from 'components/custom';

export default ({ policyStatus, clickProps }) => {

  const map = {
    disable: <CustomTag type='default' text='未开启' />,
    enable: <CustomTag type='default' text='未检测' />,
    pending: <Spin />,
    passed: <CustomTag type='success' text='合规' {...clickProps} />,
    failed: <CustomTag type='error' text='不合规' {...clickProps} />,
    violated: <CustomTag type='error' text='不合规' {...clickProps} />
  };

  return (
    <>
      {map[policyStatus]}
    </>
  );
};