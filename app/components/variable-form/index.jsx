import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Space, Form, Anchor, Affix } from 'antd';
import { GLOBAL_SCROLL_DOM_ID } from 'constants/types';
import map from 'lodash/map';
import omit from 'lodash/omit';
import VarFormTable from './components/var-form-table';
import OtherVarForm from './components/other-var-form';
import styles from './styles.less';

const { Link } = Anchor;

const VariableForm = ({ 
  varRef, 
  defaultData, 
  fetchParams, 
  canImportTerraformVar = false, 
  defaultScope, 
  showOtherVars = false,
  hasAnchor = false
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
          ([ , , { tfVarsFile, playbook } = {} ]) => {
            const data = {
              deleteVariablesId,
              variables: map([ ...terraformVarList, ...envVarList ], (it) => omit(it, ['isNew', '_key_id', 'overwrites'])),
              tfVarsFile: tfVarsFile || '',
              playbook: playbook || ''
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
    <div className={styles.variableWrapper}>
      <div className={`variable-content ${hasAnchor ? 'hasAnchor' : ''}`}>
        <Space style={{ width: '100%' }} direction='vertical' size={24}>
          <a id='terraform-var'>
            <VarFormTable 
              formVarRef={terraformVarRef}
              varList={terraformVarList}
              setVarList={setTerraformVarList}
              setDeleteVariablesId={setDeleteVariablesId}
              defaultScope={defaultScope}
              defalutVarList={defalutTerraformVarList}
              fetchParams={fetchParams}
              canImportVar={canImportTerraformVar}
              type='terraform'
            />
          </a>
          <a id='env-var'>
            <VarFormTable 
              formVarRef={envVarRef}
              varList={envVarList}
              setVarList={setEnvVarList}
              setDeleteVariablesId={setDeleteVariablesId}
              defaultScope={defaultScope}
              defalutVarList={defalutEnvVarList}
              fetchParams={fetchParams}
              canImportVar={false}
              type='environment'
            />
          </a>
          { 
            showOtherVars ? (
              <a id='other-var'>
                <OtherVarForm 
                  otherVarForm={otherVarForm}
                  fetchParams={fetchParams}
                />
              </a>
            ) : null 
          }
        </Space>
      </div>
      {
        hasAnchor ? (
          <Affix offsetTop={20} target={() => document.getElementById(GLOBAL_SCROLL_DOM_ID)}>
            <div className='variable-anchor'>
              <Anchor
                onClick={e => e.preventDefault()}
                offsetTop={20}
                affix={false}
                bounds={50}
                showInkInFixed={true}
                getContainer={() => document.getElementById(GLOBAL_SCROLL_DOM_ID)}
              >
                <Link href='#terraform-var' title='Terraform变量' />
                <Link href='#env-var' title='环境变量' />
                { showOtherVars ? <Link href='#other-var' title='其它变量' /> : null }
              </Anchor>
            </div>
          </Affix>
        ) : null
      }
    </div>
  );
};

export default VariableForm;
