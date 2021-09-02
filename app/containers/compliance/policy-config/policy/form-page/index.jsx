import React, { useState, useEffect } from "react";
import { Select, Form, Input, Button, Row, Col, Space } from "antd";
import PageHeader from "components/pageHeader";
import Layout from "components/common/layout";
import { POLICIES_SEVERITY_ENUM } from 'constants/types';
import CoderCard from 'components/coder/coder-card';

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

  const test = () => {
    setOutput(rego + '\r' + input);
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
            <Row gutter={[0, 24]}>
              <Col span={24}>
                <CoderCard 
                  title='输入' 
                  value={input} 
                  onChange={setInput}
                  bodyStyle={{ height: 200 }}
                  tools={['fullScreen']}
                />
              </Col>
              <Col span={24}>
                <CoderCard
                  title='输出'
                  value={output}
                  bodyStyle={{ height: 200 }}
                  tools={['fullScreen']}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={test}>测试</Button>
            <Button type='primary'>保存</Button>
          </Space>
        </div>
      </div>
    </Layout>
  );
};

export default FormPage;
