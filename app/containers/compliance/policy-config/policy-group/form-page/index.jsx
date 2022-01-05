import React, { useState, useEffect, useRef, Component } from 'react';
import { Steps } from 'antd';
import { connect } from "react-redux";
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import cgroupsAPI from 'services/cgroups';
import Layout from "components/common/layout";
import PageHeader from "components/pageHeader";
import FormPageContext from './form-page-context';
import Source from './source';
import Seting from './seting';
import styles from './styles.less';

const { Step } = Steps;

const steps = [
  { type: 'source', title: '选择来源', content: <Source /> },
  { type: 'seting', title: '策略组设置', content: <Seting /> }
];

const FormPage = ({ match = {} }) => {

  const { policyGroupId } = match.params || {};
  const isCreate = !policyGroupId;
  const [ current, setCurrent ] = useState(0);
  const [ formData, setFormData ] = useState({});

  return (
    <Layout
      extraHeader={<PageHeader title={policyGroupId ? '编辑策略组' : '新建策略组'} breadcrumb={true}/>}
    >
      <div className='idcos-card'>
        <div className={styles.formPage}>
          <Steps current={current}>
            {steps.map(item => (
              <Step key={item.type} title={item.title} />
            ))}
          </Steps>
          <div className='step-content'>
            <FormPageContext.Provider
              value={{
                formData,
                setFormData,
                setCurrent,
                type: steps[current].type,
                isCreate
              }}
            >
              {steps[current].content}
            </FormPageContext.Provider>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FormPage;

