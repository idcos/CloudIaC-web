import React, { useState, useCallback } from 'react';
import { Steps } from 'antd';

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';

import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';

import styles from './styles.less';

const { Step } = Steps;

const steps = {
  step1: '选择仓库',
  step2: '变量设置',
  step3: '关联项目'
};

const CTFormSteps = ({ orgId }) => {
  const [ step, setStep ] = useState(0),
    [ vcsId, setVcsId ] = useState(),
    [ selection, setSelection ] = useState({});

  const stepHelper = useCallback(() => {
    return {
      next: () => setStep(step + 1),
      prev: () => setStep(step != 0 ? step - 1 : 0)
    };
  }, [step]);

  return (
    <div className={styles.ctCreate}>
      <div className='stepWrapper'>
        <Steps current={step}>
          {Object.keys(steps).map(it => <Step title={steps[it]} />)}
        </Steps>
      </div>
      <div className={`${step != 0 ? 'hidden' : ''}`}>
        <Step1
          stepHelper={stepHelper()}
          selection={selection}
          setSelection={setSelection}
          vcsId={vcsId}
          setVcsId={setVcsId}
          orgId={orgId}
        />
      </div>
      <div className={`${step != 1 ? 'hidden' : ''}`}>
        <Step2
          selection={selection}
          stepHelper={stepHelper()}
          vcsId={vcsId}
          orgId={orgId}
        />
      </div>
      <div className={`${step != 2 ? 'hidden' : ''}`}>
        <Step3
          selection={selection}
          stepHelper={stepHelper()}
          vcsId={vcsId}
          orgId={orgId}
        />
      </div>
    </div>
  );
};

export default Eb_WP()(CTFormSteps);

