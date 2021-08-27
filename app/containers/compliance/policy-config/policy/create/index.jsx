import React, { useEffect } from "react";
import { Select, Form, Input, Button, Row, Col, Radio } from "antd";
import PageHeader from "components/pageHeader";

import Layout from "components/common/layout";

const FL = {
  labelCol: { span: 22, offset: 2 },
  wrapperCol: { span: 22, offset: 2 }
};
const PL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
const { Option, OptGroup } = Select;
const {} = Radio;
  
const Index = ({ match = {} }) => {
  const { orgId, projectId, envId, tplId } = match.params || {};
  const [form] = Form.useForm();
  
  useEffect(() => {
    return;
  }, []);

  // 获取Info
  const fetchInfo = async () => {
    return;
  };

  const onFinish = async (taskType) => {
    return;
  };

  return (
    <Layout
      extraHeader={<PageHeader title={!!envId ? '重新部署' : '部署新环境'} breadcrumb={true} />}
    >
      <div className='idcos-card'>
        <Form
          scrollToFirstError={true}
          colon={true}
          form={form}
          {...FL}
          layout={'vertical'}
        >
          <Row>
            <Col span={8}>
              <Form.Item
                label='环境名称：'
                name='name'
                rules={[
                  {
                    required: true,
                    message: '请输入'
                  }
                ]}
              >
                <Input placeholder={'请输入环境名称'} style={{ width: '80%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label='标签：'
                name='revision'
              >
                <Input placeholder={'请输入环境名称'} style={{ width: '80%' }} />
                
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ display: 'flex', justifyContent: 'center' }}>
            <Button htmlType='submit' onClick={() => onFinish('plan')} style={{ marginTop: 20 }} >Plan计划</Button>
            <Button htmlType='submit' onClick={() => onFinish('apply')} style={{ marginTop: 20, marginLeft: 20 }} type='primary' >执行部署</Button>
          </Row>
        </Form>
      </div>
    </Layout>
  );
};

export default Index;
