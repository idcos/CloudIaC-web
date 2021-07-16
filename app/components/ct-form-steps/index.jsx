import React, { useState, useCallback } from 'react';
import { Steps } from 'antd';

import { Eb_WP } from 'components/error-boundary';


import Basic from './step/basic';
import Repo from './step/repo';
import Variable from './step/variable';
import Relation from './step/relation';

import styles from './styles.less';

const { Step } = Steps;

const steps = [
  { code: 'basic', title: '基础设置', Component: Basic },
  { code: 'repo', title: '选择仓库', Component: Repo },
  { code: 'variable', title: '变量设置', Component: Variable },
  { code: 'relation', title: '关联项目', Component: Relation }
];

const CTFormSteps = ({ orgId }) => {
  const [ stepIndex, setStepIndex ] = useState(0);

  const stepHelper = useCallback(() => {
    return {
      next: () => setStepIndex(stepIndex + 1),
      prev: () => setStepIndex(stepIndex != 0 ? stepIndex - 1 : 0)
    };
  }, [stepIndex]);

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
              orgId={orgId}
            />
          ) : null
        ))
      }
    </div>
  );
};

export default Eb_WP()(CTFormSteps);

