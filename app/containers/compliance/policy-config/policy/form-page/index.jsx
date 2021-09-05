import React, { useState, useEffect } from "react";
import { Select, Form, Input, Button, Row, Col, Space, notification, Affix } from "antd";
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import history from 'utils/history';
import PageHeader from "components/pageHeader";
import Layout from "components/common/layout";
import { POLICIES_SEVERITY_ENUM } from 'constants/types';
import CoderCard from 'components/coder/coder-card';
import policiesAPI from 'services/policies';
import AffixBtnWrapper from 'components/common/affix-btn-wrapper';

const FL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
  
const FormPage = ({ match = {} }) => {

  const { policyId } = match.params || {};
  const [form] = Form.useForm();
  const [rego, setRego] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

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
      onSuccess: () => {
        history.push('/compliance/policy-config/policy');
      }
    }
  );

  const test = () => {
    setOutput(rego + '\r' + input);
  };

  const save = async () => {
    const { tags, ...restFormValues } = await form.validateFields();
    if (!rego) {
      return notification.error({
        message: '请输入策略编辑'
      });
    }
    const params = {
      tags: tags.join(','), 
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
                    rules={[
                      {
                        required: true,
                        message: '请输入'
                      }
                    ]}
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
                    rules={[
                      {
                        required: true,
                        message: '请输入'
                      }
                    ]}
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
              </Row>
            </Col>
            <Col span={8} style={{ paddingLeft: 24 }}>
              <Form.Item
                label='参考：'
                name='fixSuggestion'
                rules={[
                  {
                    required: true,
                    message: '请输入'
                  }
                ]}
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
              onChange={setInput}
              style={{ marginBottom: 24 }}
              bodyStyle={{ height: 200 }}
              tools={['fullScreen']}
            />
            <CoderCard
              title='输出'
              value={output}
              bodyStyle={{ height: 200 }}
              tools={['fullScreen']}
            />
          </Col>
        </Row>
        <AffixBtnWrapper align='right'>
          <Button onClick={test}>测试</Button>
          <Button type='primary' onClick={save} loading={saveLoading}>保存</Button>
        </AffixBtnWrapper>
      </div>
    </Layout>
  );
};

export default FormPage;
