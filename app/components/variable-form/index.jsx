import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Space, Form, Anchor } from 'antd';

import TerraformVarForm from './terraform-var-form';
import EnvVarForm from './env-var-form';
import OtherVarForm from './other-var-form';
import VarsContext from './context';
import styles from './styles.less';

const { Link } = Anchor;

const VariableForm = ({ 
  varRef, 
  defaultData, 
  fetchParams, 
  canImportTerraformVar = false, 
  defaultScope, 
  showOtherVars = false,
  hasAnchor = true
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
      <div className={styles.variableWrapper}>
        <div className={`variable-content ${hasAnchor ? 'hasAnchor' : ''}`}>
          <Space style={{ width: '100%' }} direction='vertical' size={24}>
            <a id='terraform-var'>
              <TerraformVarForm />
            </a>
            <a id='env-var'>
              <EnvVarForm />
            </a>
            { 
              showOtherVars ? (
                <a id='other-var'>
                  <OtherVarForm />
                </a>
              ) : null 
            }
          </Space>
        </div>
        {
          hasAnchor ? (
            <div className='variable-anchor'>
              <Anchor
                onClick={e => e.preventDefault()}
                affix={false}
                bounds={50}
                showInkInFixed={true}
                getContainer={() => document.querySelector('.variable-content')}
              >
                <Link href='#terraform-var' title='Terraform变量' />
                <Link href='#env-var' title='环境变量' />
                { showOtherVars ? <Link href='#other-var' title='其它变量' /> : null }
              </Anchor>
            </div>
          ) : null
        }
      </div>
    </VarsContext.Provider>
  );
};

export default VariableForm;
