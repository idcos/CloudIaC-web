import React, { useState, useCallback } from 'react';
import { Steps } from 'antd';

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';

import Step1 from './createPages/step1';
import Step2 from './createPages/step2';
import Step3 from './createPages/step3';

import styles from './styles.less';

const { Step } = Steps;

const steps = {
  step1: '选择仓库',
  step2: '变量设置',
  step3: '关联项目'
};

const CloudTmpCreate = ({ routesParams }) => {
  const [ step, setStep ] = useState(0),
    [ vcsId, setVcsId ] = useState(),
    [ selection, setSelection ] = useState({});

  const stepHelper = useCallback(() => {
    return {
      next: () => setStep(step + 1),
      prev: () => setStep(step != 0 ? step - 1 : 0)
    };
  }, [step]);

  return <Layout
    extraHeader={<PageHeader
      title='新建云模板'
      breadcrumb={true}
    />}
  >
    <div className='container-inner-width whiteBg withPadding'>
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
            curOrg={routesParams.curOrg}
          />
        </div>
        <div className={`${step != 1 ? 'hidden' : ''}`}>
          <Step2
            selection={selection}
            stepHelper={stepHelper()}
            vcsId={vcsId}
            curOrg={routesParams.curOrg}
          />
        </div>
        <div className={`${step != 2 ? 'hidden' : ''}`}>
          <Step3
            selection={selection}
            stepHelper={stepHelper()}
            vcsId={vcsId}
            curOrg={routesParams.curOrg}
          />
        </div>
      </div>
    </div>
  </Layout>;
};

export default Eb_WP()(CloudTmpCreate);

