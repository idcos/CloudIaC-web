import React, { useState, useRef, useImperativeHandle } from 'react';
import { Space, Form } from 'antd';

import TerraformVarForm from './terraform-var-form';
import EnvVarForm from './env-var-form';
import OtherVarForm from './other-var-form';
import VarsContext from './context';

const VariableForm = ({ varRef, defaultData = {}, showOtherVars = false }) => {

  const terraformVarRef = useRef();
  const envVarRef = useRef();
  const [otherVarForm] = Form.useForm();

  const [ terraformVarList, setTerraformVarList ] = useState(defaultData.terraformVarList || []);
  const [ envVarList, setEnvVarList ] = useState(defaultData.envVarList || []);

  useImperativeHandle(varRef, () => ({
    validateForm: () => {
      return new Promise((resolve, reject) => {
        let formValidates = [
          terraformVarRef.current.handleValidate(),
          envVarRef.current.handleValidate()
        ];
        if (showOtherVars) {
          formValidates.push(
            otherVarForm.validateFields()
          );
        }
        Promise.all(formValidates).then(
          ([ , , otherVarData = {} ]) => {
            const data = {
              terraformVarList,
              envVarList,
              otherVarData
            };
            resolve(data);
          },
          (err) => {
            reject(err);
          }
        );
      });
    }
  }));

  return (
    <VarsContext.Provider
      value={{
        terraformVarRef,
        terraformVarList, 
        setTerraformVarList,
        envVarRef,
        envVarList, 
        setEnvVarList,
        otherVarForm,
        otherVarData: defaultData.otherVarData || {}
      }}
    >
      <div className='variable'>
        <Space style={{ width: '100%' }} direction='vertical' size={24}>
          <TerraformVarForm />
          <EnvVarForm />
          {showOtherVars && <OtherVarForm />}
        </Space>
      </div>
    </VarsContext.Provider>
  );
};

export default VariableForm;
