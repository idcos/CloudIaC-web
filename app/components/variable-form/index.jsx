import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Space, Form } from 'antd';

import TerraformVarForm from './terraform-var-form';
import EnvVarForm from './env-var-form';
import OtherVarForm from './other-var-form';
import VarsContext from './context';

const VariableForm = ({ 
  varRef, 
  defaultData, 
  fetchParams, 
  canImportTerraformVar = false, 
  defaultScope, 
  showOtherVars = false 
}) => {

  const terraformVarRef = useRef();
  const envVarRef = useRef();
  const [otherVarForm] = Form.useForm();

  const [ deleteVariablesId, setDeleteVariablesId ] = useState([]);
  const [ terraformVarList, setTerraformVarList ] = useState([]);
  const [ envVarList, setEnvVarList ] = useState([]);
  const [ defalutTerraformVarList, setDefalutTerraformVarList ] = useState([]);
  const [ defalutEnvVarList, setDefalutEnvVarList ] = useState([]);

  useEffect(() => {
    if (!defaultData) {
      return;
    }
    const { variables = [], tfVarsFile, playbook } = defaultData;
    const defaultTerraformVars = variables.filter(it => it.type === 'terraform').map(it => {
      if (defaultScope !== it.scope) {
        it.overwrites = { ...it };
      }
      return it;
    });
    const defaultEnvVars = variables.filter(it => it.type === 'environment').map(it => {
      if (defaultScope !== it.scope) {
        it.overwrites = { ...it };
      }
      return it;
    });
    setDefalutTerraformVarList(defaultTerraformVars);
    setDefalutEnvVarList(defaultEnvVars);
    setTerraformVarList(defaultTerraformVars);
    setEnvVarList(defaultEnvVars);
    if (showOtherVars) {
      otherVarForm.setFieldsValue({ tfVarsFile: tfVarsFile || undefined, playbook: playbook || undefined });
    }
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
        defaultScope,
        defalutTerraformVarList,
        defalutEnvVarList,
        fetchParams,
        canImportTerraformVar
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
