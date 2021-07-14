import React, { useState, useEffect, useRef } from "react";
import { Space, Tooltip, Select, Form, Input, Button, Checkbox, notification, Row, Col } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import PageHeaderPlus from "components/pageHeaderPlus";
import VariableForm from 'components/variable-form';
import LayoutPlus from "components/common/layout/plus";
import CTFormSteps from 'components/ct-form-steps';

const FL = {
  labelCol: { span: 22, offset: 2 },
  wrapperCol: { span: 22, offset: 2 }
};
const PL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
let autoDestroy = [
  { name: '不限', code: '0' },
  { name: '12小时', code: '12h' },
  { name: '一天', code: '1d' },
  { name: '三天', code: '3d' },
  { name: '一周', code: '1w' },
  { name: '半个月', code: '15d' },
  { name: '一个月', code: '28/29/30/31' }
];
const { Option } = Select;
  
export default ({ match = {} }) => {
  const { orgId } = match.params || {};
  const varRef = useRef();
  const [form] = Form.useForm();
  const onFinish = async(values) => {
    console.log(values);
  };
  return (
    <LayoutPlus
      extraHeader={<PageHeaderPlus title='部署新环境' breadcrumb={true} />}
    >
      <div className='idcos-card'>
        <Form
          colon={true}
          form={form}
          {...FL}
          onFinish={onFinish}
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
                <Input style={{ width: '80%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label='生命周期：'
                name='autoDestroyAt'
                rules={[
                  {
                    required: true,
                    message: '请选择'
                  }
                ]}
              >
                <Select 
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placeholder='请选择生命周期'
                  style={{ width: '80%' }}
                >
                  {autoDestroy.map(it => <Option value={it.code}>{it.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<span>target：<Tooltip title='Target是指通过资源定位来对指定的资源进行部署，如果制定了资源名称或路径，则Terraform在执行时将仅生成包含制定资源的计划，并仅针对该计划进行部署'><InfoCircleOutlined /></Tooltip></span>}
                name='target'
                rules={[
                  {
                    required: true,
                    message: '请输入target'
                  }
                ]}
              >
                <Input style={{ width: '80%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item
                label='vcs'
                name='vcs'
                rules={[
                  {
                    required: true,
                    message: '请选择'
                  }
                ]}
              >
                <Select 
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placeholder='请选择vcs'
                  style={{ width: '80%' }}
                >
                  {[ 1, 2, 3, 4, 5 ].map(it => <Option value={it}>{it}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label='vcs'
                name='vcs'
                rules={[
                  {
                    required: true,
                    message: '请选择'
                  }
                ]}
              >
                <Select 
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placeholder='请选择vcs'
                  style={{ width: '80%' }}
                >
                  {[ 1, 2, 3, 4, 5 ].map(it => <Option value={it}>{it}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label='vcs'
                name='vcs'
                rules={[
                  {
                    required: true,
                    message: '请选择'
                  }
                ]}
              >
                <Select 
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placeholder='请选择vcs'
                  style={{ width: '80%' }}
                >
                  {[ 1, 2, 3, 4, 5 ].map(it => <Option value={it}>{it}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name='vcs'
            rules={[
              {
                required: true,
                message: '请选择'
              }
            ]}
            {...PL}
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                <Col span={8} style={{ paddingLeft: '3%' }}>
                  <Checkbox value='A'>每次推送到该分支时自动重新部署</Checkbox>
                </Col>
                <Col span={8} style={{ paddingLeft: '3%' }}>
                  <Checkbox value='B'>该分支提交PR/MR时自动执行plan计划</Checkbox>
                </Col>
                <Col span={8} style={{ paddingLeft: '3%' }}>
                  <Checkbox value='C'>自动通过审批</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <VariableForm varRef={varRef} />
          <Form.Item wrapperCol={{ offset: 12, span: 24 }}>
            <Button style={{ marginTop: 20 }} type='primary' >执行部署</Button>
          </Form.Item>
        </Form>
      </div>
    </LayoutPlus>
  );
};
