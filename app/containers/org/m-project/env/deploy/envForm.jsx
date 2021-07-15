import React, { useState, useEffect, useRef } from "react";
import { Space, Tooltip, Select, Form, Input, Button, Checkbox, DatePicker, Row, Col } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import PageHeaderPlus from "components/pageHeaderPlus";
import LayoutPlus from "components/common/layout/plus";
import CTFormSteps from 'components/ct-form-steps';
import moment from 'moment';

const FL = {
  labelCol: { span: 22, offset: 2 },
  wrapperCol: { span: 22, offset: 2 }
};
const PL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
// let autoDestroy = [
//   { name: '不限', code: '0', time: '0' },
//   { name: '12小时', code: '12h', time: moment().add(12, "hours").format("YYYY-MM-DD HH:mm") },
//   { name: '一天', code: '1d', time: moment().add(1, "days").format("YYYY-MM-DD HH:mm") },
//   { name: '三天', code: '3d', time: moment().add(3, "days").format("YYYY-MM-DD HH:mm") },
//   { name: '一周', code: '1w', time: moment().add(1, "weeks").format("YYYY-MM-DD HH:mm") },
//   { name: '半个月', code: '15d', time: moment().add(15, "days").format("YYYY-MM-DD HH:mm") },
//   { name: '一个月', code: '28/29/30/31', time: moment().add(1, "months").format("YYYY-MM-DD HH:mm") }
// ];

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
  
export default ({ match = {}, childRef }) => {
  const { orgId } = match.params || {};
  const varRef = useRef();
  const [form] = Form.useForm();
  const onFinish = async() => {
    const values = form.getFieldsValue();
    console.log(values);
  };
  useEffect(() => {
    console.log();
  }, []);
  return (
    <LayoutPlus
      extraHeader={<PageHeaderPlus title='部署新环境' breadcrumb={true} />}
    >
      <div className='idcos-card'>
        <Form
          colon={true}
          form={form}
          getContainer={false}
          {...FL}
          onFinish={onFinish}
          layout={'vertical'}
        >
          <Row>
            <Col span={8}>
              <Form.Item
                label='环境名称:'
                name='name'
                rules={[
                  {
                    required: true,
                    message: '请输入环境名称'
                  }
                ]}
              >
                <Input placeholder={'请输入环境名称'}style={{ width: '80%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label='生命周期:'
                name='destroyAt'
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
                  dropdownRender={menu => (
                    <div>
                      {menu}
                      {/* <Divider style={{ margin: '4px 0' }} /> */}
                      <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                        <DatePicker placeholder={'自定义日期'}/>
                      </div>
                    </div>
                  )}
                >
                  {autoDestroy.map(it => <Option value={it.code}>{it.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<span>target: <Tooltip title='Target是指通过资源定位来对指定的资源进行部署，如果制定了资源名称或路径，则Terraform在执行时将仅生成包含制定资源的计划，并仅针对该计划进行部署'><InfoCircleOutlined /></Tooltip></span>}
                name='targets'
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
                label='分支/标签:'
                name='revision'
                rules={[
                  {
                    required: true,
                    message: '请选择分支/标签'
                  }
                ]}
              >
                <Select 
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placeholder='请选择分支/标签'
                  style={{ width: '80%' }}
                >
                  {[ 1, 2, 3, 4, 5 ].map(it => <Option value={it}>{it}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label='部署通道:'
                name='runnerId'
                rules={[
                  {
                    required: true,
                    message: '请选择部署通道'
                  }
                ]}
              >
                <Select 
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placeholder='请选择部署通道'
                  style={{ width: '80%' }}
                >
                  {[ 1, 2, 3, 4, 5 ].map(it => <Option value={it}>{it}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label='密钥'
                name='vcs'
                rules={[
                  {
                    required: true,
                    message: '请选择密钥'
                  }
                ]}
              >
                <Select 
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placeholder='请选择密钥'
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
                  <Checkbox value='commit'>每次推送到该分支时自动重新部署</Checkbox>
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
          <Form.Item wrapperCol={{ offset: 12, span: 24 }}>
            <Button onClick={onFinish} style={{ marginTop: 20 }} type='primary' >执行部署</Button>
          </Form.Item>
        </Form>
      </div>
    </LayoutPlus>
  );
};
