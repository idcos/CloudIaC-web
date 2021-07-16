import React, { useRef, useEffect } from 'react';
import { Button, Space } from "antd";

import VariableForm from 'components/variable-form';

export default ({ stepHelper, type, ctData }) => {

  const varRef = useRef();

  const onNext = async () => {
    const varData = await varRef.current.validateForm();
    stepHelper.updateData({
      type, 
      data: varData
    });
    stepHelper.next();
  };

  return <div className='form-wrapper'>
    <VariableForm varRef={varRef} showOtherVars={true} defaultScope='template' defaultData={ctData[type]} />
    <div className='btn-wrapper'>
      <Space size={24}>
        <Button onClick={() => stepHelper.prev()}>上一步</Button>
        <Button type='primary' onClick={onNext}>下一步</Button>
      </Space>
    </div>
  </div>;
};
