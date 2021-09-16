import React, { useState, useEffect } from "react";
import { Select, Form, Input, Button, Row, Col, Spin, notification } from "antd";
import { connect } from "react-redux";
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import history from 'utils/history';
import { safeJsonStringify, isJsonString } from 'utils/util';
import PageHeader from "components/pageHeader";
import Layout from "components/common/layout";
import { POLICIES_SEVERITY_ENUM } from 'constants/types';
import CoderCard from 'components/coder/coder-card';
import policiesAPI from 'services/policies';
import cenvAPI from 'services/cenv';
import ctplAPI from 'services/ctpl';
import cgroupsAPI from 'services/cgroups';
import AffixBtnWrapper from 'components/common/affix-btn-wrapper';
import styles from './styles.less';

const FL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
  
const FormPage = ({ orgs, match = {} }) => {

  const orgOptions = ((orgs || {}).list || []).map(it => ({ label: it.name, value: it.id }));
  const { policyId } = match.params || {};
  const [form] = Form.useForm();
  const [rego, setRego] = useState();
  const [input, mutateInput] = useState();
  const [parseOrgId, setParseOrgId] = useState();
  const [parseType, setParseType] = useState('template');
  const [parseParams, setParseParams] = useState({
    envId: undefined,
    tplId: undefined
  });

  useEffect(() => {
    if (parseParams.envId || parseParams.tplId) {
      fetchInput();
    }
  }, [parseParams]);

  useEffect(() => {
    if (!parseOrgId) {
      return;
    }
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
  }, [parseOrgId, parseType]);

  // input获取
  const { run: fetchInput, loading: fetchInputLoading } = useRequest(
    () => requestWrapper(
      policiesAPI.parse.bind(null, parseParams),
    ),
    {
      manual: true,
      formatResult: (res) => safeJsonStringify([res.template, null, 2]),
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
      ctplAPI.list.bind(null, { currentPage: 1, pageSize: 100000, orgId: parseOrgId }),
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
      cenvAPI.list.bind(null, { currentPage: 1, pageSize: 100000, orgId: parseOrgId }),
      {
        formatDataFn: (res) => ((res.result || {}).list || []).map((it) => ({ label: it.name, value: it.id, tplId: it.tplId }))
      }
    ),
    {
      manual: true
    }
  );
  
  // 策略组选项查询
  const { data: policyGroupOptions } = useRequest(
    () => requestWrapper(
      cgroupsAPI.list.bind(null, { currentPage: 1, pageSize: 100000 }),
      {
        formatDataFn: (res) => ((res.result || {}).list || []).map((it) => ({ label: it.name, value: it.id }))
      }
    )
  );

  // 策略测试接口
  const { data: outputInfo = {}, run: runTest, loading: testLoading } = useRequest(
    () => requestWrapper(
      policiesAPI.test.bind(null, { input, rego }),
    ),
    {
      manual: true,
      formatResult: (res) => ({
        value: res.error || safeJsonStringify([res.data, null, 2]),
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
        const { tags, rego, ...restFormValues } = res || {};
        setRego(rego);
        form.setFieldsValue({
          tags: tags ? tags.split(',') : [],
          ...restFormValues
        });
      }
    }
  );

  // 创建/编辑策略-保存提交
  const {
    loading: saveLoading,
    run: onSave
  } = useRequest(
    (api, params) => requestWrapper(
      api.bind(null, params),
      {
        autoSuccess: true
      }
    ), {
      manual: true,
      onSuccess: () => goPolicyListPage()
    }
  );

  const goPolicyListPage = () => history.push('/compliance/policy-config/policy');

  const test = () => {
    if (!rego) {
      return notification.error({
        message: '策略编辑不能为空'
      });
    }
    if (!input || !isJsonString(input)) {
      return notification.error({
        message: '输入必须为合法 json 字符串，且不能为空'
      });
    }
    runTest();
  };

  const save = async () => {
    const { tags, ...restFormValues } = await form.validateFields();
    const params = {
      tags: tags && tags.join(','), 
      ...restFormValues, 
      rego, 
    };
    if (policyId) {
      // 编辑
      onSave(policiesAPI.update, {
        ...params,
        id: policyId 
      });
    } else {
      // 创建
      onSave(policiesAPI.create, params);
    }
  };
  
  return (
    <Layout
      extraHeader={<PageHeader title={!!policyId ? '编辑策略' : '新建策略'} breadcrumb={true}/>}
    >
      <div className='idcos-card'>
        <Spin spinning={pageLoading}>
          <Form
            scrollToFirstError={true}
            form={form}
            {...FL}
            layout={'vertical'}
          >
            <Row>
              <Col span={16}>
                <Row>
                  <Col span={12} style={{ paddingRight: 24 }}>
                    <Form.Item
                      label='策略名称：'
                      name='name'
                      rules={[
                        {
                          required: true,
                          message: '请输入'
                        }
                      ]}
                    >
                      <Input placeholder={'请输入策略名称'}/>
                    </Form.Item>
                  </Col>
                  <Col span={12} style={{ padding: '0 12px' }}>
                    <Form.Item
                      label='标签：'
                      name='tags'
                    >
                      <Select 
                        mode='tags' 
                        placeholder='请填写标签'
                        notFoundContent='输入标签并回车'
                      ></Select>
                    </Form.Item>
                  </Col>
                  <Col span={12} style={{ paddingRight: 24 }}>
                    <Form.Item
                      label='严重性：'
                      name='severity'
                      initialValue='medium'
                    >
                      <Select 
                        placeholder='选择严重性'
                      >
                        {
                          Object.keys(POLICIES_SEVERITY_ENUM).map((it) => (
                            <Select.Option value={it}>{POLICIES_SEVERITY_ENUM[it]}</Select.Option>
                          ))
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12} style={{ padding: '0 12px' }}>
                    <Form.Item
                      label='绑定策略组：'
                      name='groupId'
                    >
                      <Select 
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                        placeholder='绑定策略组'
                        options={policyGroupOptions}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={8} style={{ paddingLeft: 24 }}>
                <Form.Item
                  label='参考：'
                  name='fixSuggestion'
                >
                  <Input.TextArea 
                    autoSize={{ minRows: 5, maxRows: 5 }}
                    placeholder={'请输入策略名称'}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Row gutter={[24, 0]}>
            <Col span={12}>
              <CoderCard 
                title='策略编辑' 
                bodyStyle={{ height: 491 }}
                options={{ mode: 'rego' }} 
                value={rego} 
                onChange={setRego}
                tools={['fullScreen']}
              />
            </Col>
            <Col span={12}>
              <CoderCard 
                title='输入'
                value={input} 
                onChange={mutateInput}
                style={{ marginBottom: 24 }}
                bodyStyle={{ height: 200 }}
                tools={['fullScreen']}
                spinning={fetchInputLoading}
                bodyBefore={
                  <Row gutter={[ 8, 0 ]} className={styles.input_condition}>
                    <Col span={12}>
                      <Select
                        style={{ width: '100%' }} 
                        placeholder='请选择组织'
                        options={orgOptions}
                        optionFilterProp='label'
                        showSearch={true}
                        onChange={setParseOrgId}
                      />
                    </Col>
                    <Col span={12}>
                      <Input.Group compact={true}>
                        <Select 
                          style={{ width: '36%' }} 
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
                              style={{ width: '64%' }} 
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
                              style={{ width: '64%' }}
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
                title='输出'
                value={outputInfo.value}
                bodyStyle={{ height: 200 }}
                options={{ mode: outputInfo.isError ? 'error-message' : 'application/json' }}
                tools={['fullScreen']}
              />
            </Col>
          </Row>
          <AffixBtnWrapper align='right'>
            <Button onClick={goPolicyListPage}>取消</Button>
            <Button onClick={test} loading={testLoading}>测试</Button>
            <Button type='primary' onClick={save} loading={saveLoading}>保存</Button>
          </AffixBtnWrapper>
        </Spin>
      </div>
    </Layout>
  );
};

export default connect((state) => {
  return {
    orgs: state.global.get('orgs').toJS()
  };
})(FormPage);
