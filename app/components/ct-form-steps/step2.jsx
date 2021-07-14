import React, { useRef } from 'react';
import { Button } from "antd";

import VariableForm from 'components/variable-form';

export default ({ stepHelper }) => {

  const varRef = useRef();

  const onNext = async () => {
    const varData = await varRef.current.validateForm();
    stepHelper.next();
  };

  return <div className='variable-wrapper'>
    <VariableForm varRef={varRef} showOtherVars={true} />
    <div className='btn-wrapper'>
      <Button onClick={() => stepHelper.prev()}>上一步</Button>
      <Button type='primary' onClick={onNext}>下一步</Button>
    </div>
  </div>;
};
