import React, { useState, useEffect, useRef, Component } from 'react';
import { Steps } from 'antd';
import isFunction from 'lodash/isFunction';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import cgroupsAPI from 'services/cgroups';
import history from 'utils/history';
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

  const { orgId, policyGroupId } = match.params || {};
  const isCreate = !policyGroupId;
  const [ current, setCurrent ] = useState(0);
  const [ formData, setFormData ] = useState({});
  const [ ready, setReady ] = useState(false);
  const stepRef = useRef();

  useEffect(() => {
    if (!isCreate) {
      fetchDetail();
    } else {
      setReady(true);
    }
  }, []);

  // 策略组详情
  const {
    loading: detailLoading,
    run: fetchDetail
  } = useRequest(
    () => requestWrapper(
      cgroupsAPI.detail.bind(null, { policyGroupId })
    ), {
      manual: true,
      onSuccess: (data) => {
        const formData = paramsToformData(data);
        setFormData(formData);
        setReady(true);
      }
    }
  );

  const formDataToParams = (formData) => {
    let params = {};
    steps.forEach(({ type }) => {
      params = { ...params, ...formData[type] };
    });
    return params;
  };

  const paramsToformData = (params) => {
    const { 
      source, vcsId, repoId, repoFullName, branch, gitTags, dir,
      name, description, labels
    } = params || {};
    return {
      source: {
        source, 
        vcsId, 
        repoId, 
        repoFullName, 
        repoRevision: branch || gitTags, 
        branch, 
        gitTags,
        dir
      },
      seting: {
        name, description, labels
      }
    };
  };

  const linkToPolicyGroupList = () => {
    history.push(`/org/${orgId}/compliance/policy-config/policy-group`);
  };

  // 创建策略组
  const {
    loading: createLoading,
    run: create
  } = useRequest(
    (params) => requestWrapper(
      cgroupsAPI.create.bind(null, params), {
        autoSuccess: true
      }
    ), {
      manual: true,
      onSuccess: () => {
        linkToPolicyGroupList();
      }
    }
  );

  // 更新策略组
  const {
    loading: updateLoading,
    run: update
  } = useRequest(
    (params) => requestWrapper(
      cgroupsAPI.update.bind(null, { ...params, policyGroupId }), {
        autoSuccess: true
      }
    ), {
      manual: true,
      onSuccess: () => {
        linkToPolicyGroupList();
      }
    }
  );

  const changeStep = (index) => {
    if (isCreate || !stepRef.current) {
      return;
    }
    // 编辑时校验保存表单
    if (isFunction(stepRef.current.onFinish)) {
      stepRef.current.onFinish(index);
    }
  };

  return (
    <Layout
      extraHeader={<PageHeader title={policyGroupId ? '编辑策略组' : '新建策略组'} breadcrumb={true}/>}
    >
      <div className='idcos-card'>
        <div className={styles.formPage}>
          <Steps current={current}>
            {steps.map((item, index) => (
              <Step key={item.type} title={item.title} onClick={() => changeStep(index)}/>
            ))}
          </Steps>
          <div className='step-content'>
            <FormPageContext.Provider
              value={{
                formData,
                setFormData,
                setCurrent,
                type: steps[current].type,
                formDataToParams,
                linkToPolicyGroupList,
                isCreate,
                ready,
                create,
                createLoading,
                update,
                updateLoading,
                stepRef
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

