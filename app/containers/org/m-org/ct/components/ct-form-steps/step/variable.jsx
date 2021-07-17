import React, { useRef, useMemo } from 'react';
import { Button, Space } from "antd";

import VariableForm from 'components/variable-form';

export default ({ stepHelper, type, ctData, orgId }) => {

  const varRef = useRef();

  const onNext = async () => {
    const varData = await varRef.current.validateForm();
    stepHelper.updateData({
      type, 
      data: varData
    });
    stepHelper.next();
  };

  const fetchParams = useMemo(() => {
    if (!ctData.repo) {
      return null;
    }
    return {
      orgId, ...ctData.repo
    };
  }, [ ctData, orgId ]);

  return <div className='form-wrapper'>
    <VariableForm 
      varRef={varRef} 
      showOtherVars={true} 
      canImportTerraformVar={true}
      defaultScope='template' 
      defaultData={ctData[type]} 
      fetchParams={fetchParams}
    />
    <div className='btn-wrapper'>
      <Space size={24}>
        <Button onClick={() => stepHelper.prev()}>上一步</Button>
        <Button type='primary' onClick={onNext}>下一步</Button>
      </Space>
    </div>
  </div>;
};