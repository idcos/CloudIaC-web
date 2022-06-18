import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Steps, notification } from 'antd';
import set from 'lodash/set';
import isFunction from 'lodash/isFunction';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { formatVariableRequestParams } from 'components/variable-form';
import { Eb_WP } from 'components/error-boundary';
import { TFVERSION_AUTO_MATCH } from 'constants/types';
import varsAPI from 'services/variables';
import tplAPI from 'services/tpl';
import vcsAPI from 'services/vcs';
import history from "utils/history";
import { t } from 'utils/i18n';
import Basic from './step/basic';
import Variable from './step/variable';
import Relation from './step/relation';
import styles from './styles.less';

const defaultScope = 'template';
const { Step } = Steps;

const steps = [
  { type: 'variable', title: t('define.variable'), Component: Variable },
  { type: 'basic', title: t('define.setting'), Component: Basic },
  { type: 'relation', title: t('define.ct.import.init.associatedProject'), Component: Relation }
];

const CTFormSteps = ({ orgId, tplId, opType, queryInfo }) => {
  
  const [ stepIndex, setStepIndex ] = useState(0);
  const [ ctData, setCtData ] = useState({});
  const stepRef = useRef();

  const {
    data: repoInfo = {}
  } = useRequest(
    () => requestWrapper(
      vcsAPI.getRegistryVcs.bind(null, { orgId })
    ), {
      formatResult: data => data ? {
        vcsId: data.id,
        ...queryInfo
      } : {}
    }
  );

  // 创建/编辑云模板提交接口
  const {
    run: onSave,
    loading: saveLoading
  } = useRequest(
    (params) => requestWrapper(
      tplAPI[opType === 'add' ? 'create' : 'update'].bind(null, formatVariableRequestParams(params, defaultScope))
    ),
    {
      manual: true,
      onSuccess: () => goCTlist()
    }
  );

  // 校验接口
  const {
    run: onlineCheckForm
  } = useRequest(
    (params) => requestWrapper(
      tplAPI.check.bind(null, { ...params, templateId: tplId, orgId }), {
        autoError: false
      }
    ),
    {
      manual: true,
      onError: (err) => {
        const { code, message, message_detail } = (err || {}).res || {};
        if (code == 50010340) {
          notification.error({
            message: t('define.ct.message.50010340')
          });
        } else {
          notification.error({
            message: message || t('define.message.opSuccess'),
            description: message_detail
          });
        }
      }
    }
  );

  const stepHelper = useCallback(() => {
    return {
      go: (index) => setStepIndex(index),
      next: () => setStepIndex(stepIndex + 1),
      prev: () => setStepIndex(stepIndex != 0 ? stepIndex - 1 : 0),
      updateData: ({ type, data, isSubmit }) => {
        const newCtData = { ...ctData, [type]: data };
        if (isSubmit) {
          submit(newCtData);
        } else {
          setCtData(newCtData);
        }
      }
    };
  }, [ stepIndex, ctData ]);

  const goCTlist = () => {
    history.push(`/org/${orgId}/m-org-ct`);
  };

  const submit = (data) => {
    const { basic, variable, relation } = data;
    let params = {
      ...variable, 
      ...basic, 
      ...relation,
      ...repoInfo,
      orgId,
      tplId,
      source: 'registry'
    };
    if (params.tfVersion === TFVERSION_AUTO_MATCH) {
      params.tfVersion = params.autoMatchTfVersion;
      delete params.autoMatchTfVersion;
    }
    onSave(params);
  };

  useEffect(() => {
    switch (opType) {
    case 'add':
      getVars();
      break;
    default:
      break;
    }
  }, [opType]);

  const getVars = async () => {
    try {
      const res = await varsAPI.search({ orgId, tplId, scope: 'template' });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setCtData(preCtData => set(preCtData, 'variable.variables', res.result || []));
    } catch (e) {
      notification.error({
        message: t('define.message.getFail'),
        description: e.message
      });
    }
  };

  const changeStep = (index) => {
    if (opType === 'add' || !stepRef.current) {
      return;
    }
    // 编辑时校验保存表单
    if (isFunction(stepRef.current.onFinish)) {
      stepRef.current.onFinish(index);
    }
  };

  return (
    <div className={styles.ctCreate}>
      <div className='stepWrapper'>
        <Steps current={stepIndex}>
          {steps.map((it, index) => (
            <Step style={{ cursor: opType === 'add' ? 'default' : 'pointer' }} title={it.title} onClick={() => changeStep(index)}/>
          ))}
        </Steps>
      </div>
      {
        steps.map((it, index) => (
          stepIndex === index ? (
            <it.Component
              childRef={stepRef}
              stepHelper={stepHelper()}
              ctData={ctData}
              orgId={orgId}
              type={it.type}
              tplId={tplId}
              opType={opType}
              goCTlist={goCTlist}
              isShow={stepIndex === index}
              saveLoading={saveLoading}
              onlineCheckForm={onlineCheckForm}
              repoInfo={repoInfo}
            />
          ) : null
        ))
      }
    </div>
  );
};

export default Eb_WP()(CTFormSteps);

