import React, { useState, useCallback, useEffect } from 'react';
import { Steps, notification } from 'antd';

import { Eb_WP } from 'components/error-boundary';
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

  const stepHelper = useCallback(() => {
    return {
      next: () => setStepIndex(stepIndex + 1),
      prev: () => setStepIndex(stepIndex != 0 ? stepIndex - 1 : 0),
      updateData: ({ type, data, isSubmit }) => {
        setCtData((preCtData) => {
          const newCtData = {
            ...preCtData,
            [type]: data
          };
          if (isSubmit) {
            submit(newCtData);
          }
          return newCtData;
        });
      }
    };
  }, [stepIndex]);

  const submit = async (data) => {
    const { basic, repo, variable, relation } = data;
    const params = {
      ...basic, 
      ...repo, 
      ...variable, 
      ...relation,
      orgId,
      tplId
    };
    try {
      const res = await tplAPI[opType === 'add' ? 'create' : 'update'](params);
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      history.push(`/org/${orgId}/m-org-ct`);
    } catch (e) {
      notification.error({
        message: e.message
      });
    }
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
        vcsId, repoId, repoRevision, workdir,
        variables, tfVarsFile, playbook,
        projectId
      } = res.result || {};
      setCtData({
        basic: { name, description },
        repo: { vcsId, repoId, repoRevision, workdir },
        variable: { variables, tfVarsFile, playbook },
        relation: { projectId }
      });
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
      setCtData(preCtData => ({
        ...preCtData,
        variable: {
          variables: res.result || []
        }
      }));
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  return (
    <div className={styles.ctCreate}>
      <div className='stepWrapper'>
        <Steps current={stepIndex}>
          {steps.map(it => <Step title={it.title} />)}
        </Steps>
      </div>
      {
        steps.map((it, index) => (
          stepIndex === index ? (
            <it.Component
              stepHelper={stepHelper()}
              ctData={ctData}
              orgId={orgId}
              type={it.type}
              isShow={stepIndex === index}
            />
          ) : null
        ))
      }
    </div>
  );
};

export default Eb_WP()(CTFormSteps);

