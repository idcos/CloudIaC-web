import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Steps, notification } from 'antd';
import set from 'lodash/set';
import isFunction from 'lodash/isFunction';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { Eb_WP } from 'components/error-boundary';
import { TFVERSION_AUTO_MATCH } from 'constants/types';
import varsAPI from 'services/variables';
import tplAPI from 'services/tpl';
import history from "utils/history";
import Basic from './step/basic';
import Repo from './step/repo';
import Variable from './step/variable';
import Relation from './step/relation';
import styles from './styles.less';

const { Step } = Steps;

const steps = [
  { type: 'basic', title: '基础设置', Component: Basic },
  { type: 'repo', title: '选择仓库', Component: Repo },
  { type: 'variable', title: '变量设置', Component: Variable },
  { type: 'relation', title: '关联项目', Component: Relation }
];

const CTFormSteps = ({ orgId, tplId, opType }) => {
  
  const [ stepIndex, setStepIndex ] = useState(0);
  const [ ctData, setCtData ] = useState({});
  const stepRef = useRef();

  // 创建/编辑云模版提交接口
  const {
    run: onSave,
    loading: saveLoading
  } = useRequest(
    (params) => requestWrapper(
      tplAPI[opType === 'add' ? 'create' : 'update'].bind(null, params)
    ),
    {
      manual: true,
      onSuccess: () =>  goCTlist()
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
  }, [stepIndex, ctData]);

  const goCTlist = () => {
    history.push(`/org/${orgId}/m-org-ct`);
  };

  const submit = (data) => {
    const { basic, repo, variable, relation } = data;
    let params = {
      ...basic, 
      ...repo, 
      ...variable, 
      ...relation,
      orgId,
      tplId
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
      case 'edit':
        fetchCTDetail();
        break;
      default:
        break;
    }
  }, [opType]);

  const fetchCTDetail = async () => {
    try {
      const res = await tplAPI.detail({
        orgId, 
        tplId
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      const {
        name, description,
        vcsId, repoId, repoRevision, workdir, tfVersion,
        tfVarsFile, playbook,
        projectId
      } = res.result || {};
      setCtData({
        basic: { name, description },
        repo: { vcsId, repoId, repoRevision, workdir, tfVersion },
        variable: { tfVarsFile, playbook },
        relation: { projectId }
      });
      getVars(); // 变量单独查询
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const getVars = async () => {
    try {
      const res = await varsAPI.search({ orgId, tplId, scope: 'template' });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setCtData(preCtData => set(preCtData, 'variable.variables', res.result || []));
    } catch (e) {
      notification.error({
        message: '获取失败',
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
            />
          ) : null
        ))
      }
    </div>
  );
};

export default Eb_WP()(CTFormSteps);

