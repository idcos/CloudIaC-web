import React, { useContext, useEffect } from 'react';
import { Row, Col, Card, Form, Select } from 'antd';

import VarsContext from '../context';

const { Option } = Select;
const tfvars = [ 'prod-env.tfvars', 'qa-env.tfvars' ];
const playbooks = ['ansible/playbook.yml'];

const OtherVarForm = () => {

  const { otherVarForm } = useContext(VarsContext);

  return (
    <Card
      title='其它变量'
    >
      <Form
        form={otherVarForm}
      >
        <Row gutter={8}>
          <Col span={11}>
            <Form.Item
              name='varfile'
              label='tfvars文件'
              rules={[
                {
                  required: false,
                  message: '请选择'
                }
              ]}
            >
              <Select
                getPopupContainer={triggerNode => triggerNode.parentNode} 
                allowClear={true} 
                placeholder='请选择tfvars文件'
              >
                {tfvars.map(it => <Option value={it}>{it}</Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name='playbook'
              label='playbook文件'
              rules={[
                {
                  required: false,
                  message: '请选择'
                }
              ]}
            >
              <Select 
                getPopupContainer={triggerNode => triggerNode.parentNode}
                allowClear={true} 
                placeholder='请选择playbook文件'
              >
                {playbooks.map(it => <Option value={it}>{it}</Option>)}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default OtherVarForm;