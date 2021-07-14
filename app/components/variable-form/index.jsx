import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Space, Form } from 'antd';

import TerraformVarForm from './terraform-var-form';
import EnvVarForm from './env-var-form';
import OtherVarForm from './other-var-form';
import VarsContext from './context';

const VariableForm = ({ varRef, defaultData = {}, defaultScope, showOtherVars = false }) => {

  const terraformVarRef = useRef();
  const envVarRef = useRef();
  const [otherVarForm] = Form.useForm();

  const [ deleteVariablesId, setDeleteVariablesId ] = useState([]);
  const [ terraformVarList, setTerraformVarList ] = useState([]);
  const [ envVarList, setEnvVarList ] = useState([]);

  useEffect(() => {
    const { variables = [], ...otherVarData } = defaultData;
    const defaultTerraformVarList = variables.filter(it => it.type === 'terraform');
    const defaultEnvVarList = variables.filter(it => it.type === 'environment'); 
    setTerraformVarList(defaultTerraformVarList);
    setEnvVarList(defaultEnvVarList);
    otherVarForm.setFieldsValue(otherVarData);
  }, [defaultData]);

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
          ([ , , otherVarFormValues = {} ]) => {
            const data = {
              deleteVariablesId,
              variables: [ ...terraformVarList, ...envVarList ],
              ...otherVarFormValues
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
        setDeleteVariablesId,
        defaultScope
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
