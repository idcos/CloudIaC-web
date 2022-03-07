import React, { useState, useEffect, useMemo } from "react";
import { Select, Input, Button, Row, Col, Spin, notification, Space } from "antd";
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

const defaultRego = 'package accurics\n\n## id 为策略在策略组中的唯一标识，由大小写英文字符、数字、"."、"_"、"-" 组成\n## 建议按`组织_云商_资源名称/分类_编号`的格式进行命名\n# @id: cloudiac_alicloud_security_p001\n\n# @name: 限制实例规格\n# @description: 限制实例规格为 nano 或者 small\n\n## 策略类型，如 aws, k8s, github, alicloud, ...\n# @policy_type: alicloud\n\n## 资源类型，如 aws_ami, k8s_pod, alicloud_ecs, ...\n# @resource_type: aliyun_ami\n\n## 策略严重级别: 可选 high/medium/low\n# @severity: medium\n\n## 策略标签，多个分类使用逗号分隔\n# @label: cat1,cat2\n\n## 策略修复建议（支持多行）\n# @fix_suggestion: 修改 instance_type 为包含 nano 或者 small 的实例类型。\n\nlimitedSmallInstanceType[instance.id] {\n\tinstance := input.alicloud_instance[_]\n\tnot contains(instance.config.instance_type, "nano")\n\tnot contains(instance.config.instance_type, "small")\n}';
  
const OnlineTest = ({ match = {} }) => {

  const { policyId, orgId } = match.params || {};
  const [ rego, setRego ] = useState(defaultRego);
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
        isError: !!res.error,
        policyStatus: res.policyStatus
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

  const TestStatus = useMemo(() => {
    const map = {
      passed: <CustomTag type='success' text='通过'/>,
      violated: <CustomTag type='error' text='不通过'/>,
      failed: <CustomTag type='error' text='错误'/>
    };
    return map[outputInfo.policyStatus];
  });
  
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
                    {TestStatus}
                  </Space>
                }
                className='idcos-common-light-background-coder'
                height={337}
                value={outputInfo.value}
                options={{ mode: outputInfo.isError ? 'error-message' : 'application/json' }}
                tools={['fullScreen']}
              />
            </Col>
          </Row>
          <AffixBtnWrapper align='right'>
            <Button onClick={goPolicyListPage}>关闭</Button>
            <Button onClick={test} type='primary' loading={testLoading}>在线测试</Button>
          </AffixBtnWrapper>
        </Spin>
      </div>
    </Layout>
  );
};

export default OnlineTest;
