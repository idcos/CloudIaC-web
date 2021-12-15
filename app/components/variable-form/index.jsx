import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Space, Form, Anchor, Affix } from 'antd';
import { GLOBAL_SCROLL_DOM_ID } from 'constants/types';
import differenceBy from 'lodash/differenceBy';
import omit from 'lodash/omit';
import intersectionBy from 'lodash/intersectionBy';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import varGroupAPI from 'services/var-group';
import { useDeepCompareEffect } from 'utils/hooks';
import VarFormTable from './var-form-table';
import OtherVarForm from './other-var-form';
import styles from './styles.less';

const { Link } = Anchor;

const VariableForm = ({ 
  varRef, 
  defaultData, 
  fetchParams, 
  canImportTerraformVar = false, 
  defaultScope, 
  showOtherVars = false,
  hasAnchor = false,
  defaultExpandCollapse = true,
  readOnly = false,
  showVarGroupList = true,
  event$
}) => {
  
  const terraformVarRef = useRef();
  const envVarRef = useRef();
  const [otherVarForm] = Form.useForm();
  const [ terraformVarList, setTerraformVarList ] = useState([]);
  const [ defalutTerraformVarList, setDefalutTerraformVarList ] = useState([]);
  const [ envVarList, setEnvVarList ] = useState([]);
  const [ defalutEnvVarList, setDefalutEnvVarList ] = useState([]);
  const [ envVarGroupList, setEnvVarGroupList ] = useState([]);
  const [ defalutEnvVarGroupList, setDefalutEnvVarGroupList ] = useState([]);
  const [ expandCollapseCfg, setExpandCollapseCfg ] = useState({
    terraform: defaultExpandCollapse,
    environment: defaultExpandCollapse
  });

  event$ && event$.useSubscription(({ type }) => {
    switch (type) {
      case 'fetchVarGroupList':
        fetchVarGroupList();
        break;
      default:
        break;
    }
  });

  // 资源账号变量组列表查询
  const {
    run: fetchVarGroupList
  } = useRequest(
    () => {
      const { orgId, tplId, projectId, envId, objectType = defaultScope } = fetchParams;
      const params = { orgId, tplId, projectId, envId, objectType: objectType };
      return requestWrapper(
        varGroupAPI.listRelationship.bind(null, params)
      );
    },
    {
      ready: !isEmpty(fetchParams) && showVarGroupList,
      onSuccess: (data) => {
        data = data || [];
        setDefalutEnvVarGroupList(data);
        const sameScopeVarGroupList = data.filter((it) => it.objectType === defaultScope);
        const otherScopeVarGroupList = data.filter((it) => {
          const sameScope = it.objectType !== defaultScope;
          if (!sameScope) {
            return false;
          }
          const hasSameVarName = !!sameScopeVarGroupList.find(sameScopeVarGroup => intersectionBy(sameScopeVarGroup.variables, it.variables, 'name').length > 0);
          return !hasSameVarName;
        });
        setEnvVarGroupList([...otherScopeVarGroupList, ...sameScopeVarGroupList]);
      }
    }
  );

  useDeepCompareEffect(() => {
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
          terraformVarRef.current.handleValidate().catch((err) => {
            setExpandCollapseCfg((preValue) => ({ ...preValue, terraform: true }));
            reject(err);
          }),
          envVarRef.current.handleValidate().catch((err) => {
            setExpandCollapseCfg((preValue) => ({ ...preValue, environment: true }));
            reject(err);
          })
        ];
        if (showOtherVars) {
          formValidates.push(
            otherVarForm.validateFields()
          );
        }
        Promise.all(formValidates).then(
          ([ , , otherVars ]) => {
            if (otherVars) {
              otherVars.tfVarsFile = otherVars.tfVarsFile || '';
              otherVars.playbook = otherVars.playbook || '';
            }
            const startVarGroupList = defalutEnvVarGroupList.filter(it => it.objectType === defaultScope);
            const endVarGroupList = envVarGroupList.filter(it => it.objectType === defaultScope);
            const varGroupIds = differenceBy(endVarGroupList, startVarGroupList, 'varGroupId').map(it => it.varGroupId);
            const delVarGroupIds = differenceBy(startVarGroupList, endVarGroupList, 'varGroupId').map(it => it.varGroupId);
            const data = {
              variables: [ ...terraformVarList, ...envVarList ],
              ...otherVars,
              varGroupIds,
              delVarGroupIds
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
              defaultScope={defaultScope}
              defalutVarList={defalutTerraformVarList}
              expandCollapse={expandCollapseCfg.terraform}
              setExpandCollapse={(expandCollapse) => setExpandCollapseCfg((preValue) => ({ ...preValue, terraform: expandCollapse }))}
              fetchParams={fetchParams}
              canImportVar={canImportTerraformVar}
              type='terraform'
              defaultExpandCollapse={defaultExpandCollapse}
              readOnly={readOnly}
            />
          </a>
          <a id='env-var'>
            <VarFormTable 
              formVarRef={envVarRef}
              varList={envVarList}
              setVarList={setEnvVarList}
              defaultScope={defaultScope}
              defalutVarList={defalutEnvVarList}
              expandCollapse={expandCollapseCfg.environment}
              setExpandCollapse={(expandCollapse) => setExpandCollapseCfg((preValue) => ({ ...preValue, environment: expandCollapse }))}
              fetchParams={fetchParams}
              canImportResourceAccount={showVarGroupList}
              defalutVarGroupList={defalutEnvVarGroupList}
              varGroupList={envVarGroupList}
              setVarGroupList={setEnvVarGroupList}
              type='environment'
              defaultExpandCollapse={defaultExpandCollapse}
              readOnly={readOnly}
            />
          </a>
          { 
            showOtherVars ? (
              <a id='other-var'>
                <OtherVarForm 
                  otherVarForm={otherVarForm}
                  fetchParams={fetchParams}
                  defaultExpandCollapse={defaultExpandCollapse}
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

// 格式化变量组件数据作为请求入参
export const formatVariableRequestParams = (data, defaultScope) => {
  const { variables, ...params } = cloneDeep(data);
  const newVariables = variables.filter(
    ({ scope }) => scope === defaultScope
  ).map(
    (it) => omit(it, ['isNew', '_key_id', 'overwrites'])
  );
  return {
    variables: newVariables,
    ...params
  };
};

export default VariableForm;

