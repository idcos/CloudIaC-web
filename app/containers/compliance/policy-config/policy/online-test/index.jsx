import React, { useState, useEffect } from "react";
import { Select, Input, Button, Row, Col, Spin, notification, Space } from "antd";
import isEmpty from 'lodash/isEmpty';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import history from 'utils/history';
import { safeJsonStringify, isJsonString } from 'utils/util';
import PageHeader from "components/pageHeader";
import Layout from "components/common/layout";
import CoderCard from 'components/coder/coder-card';
import policiesAPI from 'services/policies';
import cenvAPI from 'services/cenv';
import ctplAPI from 'services/ctpl';
import AffixBtnWrapper from 'components/common/affix-btn-wrapper';
import { CustomTag } from 'components/custom';
  
const OnlineTest = ({ match = {} }) => {

  const { policyId, orgId } = match.params || {};
  const [ rego, setRego ] = useState();
  const [ input, mutateInput ] = useState();
  const [ parseType, setParseType ] = useState('template');
  const [ parseParams, setParseParams ] = useState({
    envId: undefined,
    tplId: undefined
  });

  useEffect(() => {
    if (parseParams.envId || parseParams.tplId) {
      fetchInput();
    }
  }, [parseParams]);

  useEffect(() => {
    setParseParams({
      envId: undefined,
      tplId: undefined
    });
    switch (parseType) {
    case 'template':
      fetchCtOptions();
      break;
    case 'env':
      fetchEnvOptions();
      break;
    default:
      break;
    }
  }, [parseType]);

  // input获取
  const { run: fetchInput, loading: fetchInputLoading } = useRequest(
    () => requestWrapper(
      policiesAPI.parse.bind(null, parseParams),
    ),
    {
      manual: true,
      formatResult: (res) => safeJsonStringify([ res.template, null, 2 ]),
      onSuccess: (data) => {
        mutateInput(data);
      },
      onError: () => {
        mutateInput();
      }
    }
  );
  
  // 云模版选项查询
  const { data: ctOptions, run: fetchCtOptions } = useRequest(
    () => requestWrapper(
      ctplAPI.list.bind(null, { pageSize: 0 }),
      {
        formatDataFn: (res) => ((res.result || {}).list || []).map((it) => ({ label: it.name, value: it.id, tplId: it.tplId }))
      }
    ),
    {
      manual: true
    }
  );
  
  // 环境选项查询
  const { data: envOptions, run: fetchEnvOptions } = useRequest(
    () => requestWrapper(
      cenvAPI.list.bind(null, { pageSize: 0 }),
      {
        formatDataFn: (res) => ((res.result || {}).list || []).map((it) => ({ label: it.name, value: it.id, tplId: it.tplId }))
      }
    ),
    {
      manual: true
    }
  );

  // 策略测试接口
  const { data: outputInfo = {}, run: runTest, loading: testLoading } = useRequest(
    () => requestWrapper(
      policiesAPI.test.bind(null, { input, rego }),
    ),
    {
      manual: true,
      formatResult: (res) => ({
        value: res.error || safeJsonStringify([ res.data, null, 2 ]),
        isError: !!res.error
      })
    }
  );

  // 策略详情查询回填
  const {
    loading: pageLoading
  } = useRequest(
    () => requestWrapper(
      policiesAPI.detail.bind(null, policyId)
    ), {
      ready: !!policyId,
      onSuccess: (res) => {
        const { rego } = res || {};
        setRego(rego);
      }
    }
  );

  const goPolicyListPage = () => history.push(`/org/${orgId}/compliance/policy-config/policy`);

  const test = () => {
    if (!rego) {
      return notification.error({
        message: '策略编辑不能为空'
      });
    }
    if (!input || !isJsonString(input)) {
      return notification.error({
        message: '“测试输入”必须为合法 json 字符串，且不能为空'
      });
    }
    runTest();
  };
  
  return (
    <Layout
      extraHeader={<PageHeader title='在线测试' breadcrumb={true}/>}
    >
      <div className='idcos-card'>
        <Spin spinning={pageLoading}>
          <Row gutter={[ 24, 0 ]}>
            <Col span={12}>
              <CoderCard 
                height={680}
                title='策略编辑' 
                options={{ mode: 'rego' }} 
                value={rego} 
                onChange={setRego}
                tools={['fullScreen']}
              />
            </Col>
            <Col span={12}>
              <CoderCard 
                title='测试输入'
                height={337}
                value={input} 
                onChange={mutateInput}
                style={{ marginBottom: 6 }}
                tools={['fullScreen']}
                spinning={fetchInputLoading}
                headerMiddleContent={
                  <Row wrap={false} justify='end'> 
                    <Col flex='0 0 280px'>
                      <Input.Group compact={true}>
                        <Select 
                          style={{ width: '31%' }} 
                          placeholder='类型'
                          options={[
                            { label: '云模版', value: 'template' },
                            { label: '环境', value: 'env' }
                          ]}
                          onChange={setParseType}
                          value={parseType}
                        />  
                        {
                          parseType === 'template' && (
                            <Select 
                              style={{ width: '69%' }} 
                              placeholder='请选择云模版'
                              options={ctOptions}
                              allowClear={true}
                              optionFilterProp='label'
                              showSearch={true}
                              onChange={(tplId) => setParseParams({ tplId })}
                              value={parseParams.tplId}
                            />
                          )
                        }
                        {
                          parseType === 'env' && (
                            <Select 
                              style={{ width: '69%' }}
                              placeholder='请选择环境' 
                              options={envOptions}
                              allowClear={true}
                              optionFilterProp='label'
                              showSearch={true}
                              onChange={(envId) => setParseParams({ envId })}
                              value={parseParams.envId}
                            />
                          )
                        }
                      </Input.Group>
                    </Col>
                  </Row>
                }
              />
              <CoderCard
                title={
                  <Space>
                    <span>测试输出</span>
                    {!isEmpty(outputInfo) && (
                      outputInfo.isError ? (
                        <CustomTag type='error' text='未通过'/>
                      ) : (
                        <CustomTag type='success' text='通过'/>
                      )
                    )}
                  </Space>
                }
                height={337}
                value={outputInfo.value}
                options={{ mode: outputInfo.isError ? 'error-message' : 'application/json' }}
                tools={['fullScreen']}
              />
            </Col>
          </Row>
          <AffixBtnWrapper align='right'>
            <Button onClick={goPolicyListPage}>取消</Button>
            <Button onClick={test} type='primary' loading={testLoading}>在线测试</Button>
          </AffixBtnWrapper>
        </Spin>
      </div>
    </Layout>
  );
};

export default OnlineTest;
