import React, { useRef, useMemo, useImperativeHandle } from 'react';
import { Button, Space } from "antd";

import VariableForm from 'components/variable-form';

export default ({ childRef, stepHelper, type, opType, ctData, orgId }) => {

  const varRef = useRef();

  useImperativeHandle(childRef, () => ({
    onFinish: async (index) => {
      const varData = await varRef.current.validateForm();
      stepHelper.updateData({
        type, 
        data: varData
      });
      stepHelper.go(index);
    }
  }));

  const onFinish = async () => {
    const varData = await varRef.current.validateForm();
    stepHelper.updateData({
      type, 
      data: varData,
      isSubmit: opType === 'edit'
    });
    opType === 'add' && stepHelper.next();
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
      {
        opType === 'add' ? (
          <Space size={24}>
            <Button onClick={() => stepHelper.prev()}>上一步</Button>
            <Button type='primary' onClick={onFinish}>下一步</Button>
          </Space>
        ) : (
          <Button type='primary' onClick={onFinish}>提交</Button>
        )
      }
    </div>
  </div>;
};
