import React, { useState, useEffect, useImperativeHandle } from "react";
import { notification, Tooltip, Select, Form, Input, Collapse, Checkbox, DatePicker, Row, Col, Radio, InputNumber } from "antd";
import copy from 'utils/copy';
import { InfoCircleOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { AUTO_DESTROY, destoryType } from 'constants/types';

import tokensAPI from 'services/tokens';

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
  
const Index = ({ configRef, isCollapse, data, orgId, projectId, envId, runnner, keys, tfvars, playbooks }) => {
  const [form] = Form.useForm();
  const { Panel } = Collapse;
  const [ info, setInfo ] = useState({});
  const [ activekey, setActivekey ] = useState([]);
  const [ paramsRunnerId, setParamsRunnerId ] = useState();
  const [ tfvarsView, setTfvarsView ] = useState({ view: false, value: '' });
  const [ playbookView, setPlaybookView ] = useState({ view: false, value: '' });

  useEffect(() => {
    fetchInfo();
  }, [data]);
  
  const setTtl = (data) => {
    if (data.autoApproval) {
      data.triggers = (data.triggers || []).concat(['autoApproval']);
    }
    if (!!data.autoDestroyAt) {
      data.type = 'time';
      form.setFieldsValue({ destroyAt: moment(data.autoDestroyAt) });
    } else if ((data.ttl === '' || data.ttl === null || data.ttl == 0) && !data.autoDestroyAt) {
      data.type = 'infinite';
    } else if (!data.autoDestroyAt) {
      data.type = 'timequantum';
    }
    setInfo(data);
    form.setFieldsValue(data);
  };

  // 获取Info
  const fetchInfo = async () => {
    try {
      if (envId) {
        setTtl(data);
      }
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const onfinish = async() => {
    let value = await form.getFieldsValue();
    let values = activekey.length > 0 ? value : { runnerId: form.getFieldValue('runnerId') };
    return values;
  };

  // 新建时给runnerId赋值
  const setRunnerValue = (v) => {
    form.setFieldsValue({ runnerId: v });
    setParamsRunnerId(v);
  };

  useImperativeHandle(configRef, () => ({
    onfinish,
    setRunnerValue
  }), [ onfinish, setRunnerValue ]);

  const renderForm = () => {
    return <>
      <Row style={{ height: '100%' }}>
        <Col span={8}>
          <Form.Item
            label='部署通道：'
            name='runnerId'
            rules={[
              {
                required: true,
                message: '请选择部署通道'
              }
            ]}
          >
            <Select 
              allowClear={true}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              placeholder='请选择部署通道'
              style={{ width: '80%' }}
            >
              {runnner.map(it => <Option value={it.ID}>{it.Service}</Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={<span>tfvars文件：<span style={{ cursor: 'pointer' }} onClick={() => setTfvarsView({ view: !tfvarsView.view })}>{tfvarsView.view ? <EyeOutlined /> : <EyeInvisibleOutlined />}</span></span>}
            name='tfvars'
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
        <Col span={8}>
          <Form.Item
            label={<span>playbook文件：<span style={{ cursor: 'pointer' }} onClick={() => setPlaybookView({ view: !playbookView.view })}>{playbookView.view ? <EyeOutlined /> : <EyeInvisibleOutlined />}</span></span>}
            name='playbook'
          >
            <Select 
              allowClear={true}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              placeholder='请选择playbook文件'
              style={{ width: '80%' }}
            >
              {playbooks.map(it => <Option value={it}>{it}</Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={<span>target：<Tooltip title='Target是指通过资源定位来对指定的资源进行部署，如果制定了资源名称或路径，则Terraform在执行时将仅生成包含制定资源的计划，并仅针对该计划进行部署'><InfoCircleOutlined /></Tooltip></span>}
            name='targets'
          >
            <Input placeholder={'请输入target'} style={{ width: '80%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            style={{ marginBottom: 0 }}
            label='存活时间：'
          >
            <Row>
              <Col span={8}>
                <Form.Item 
                  name='type'
                  initialValue={'infinite'}
                >
                  <Select style={{ width: '90%' }}>
                    {destoryType.map(d => <Option value={d.value}>{d.name}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  noStyle={true}
                  shouldUpdate={true}
                >
                  {({ getFieldValue }) => {
                    let type = getFieldValue('type'); 
                    if (type === 'infinite') {
                      return <></>;
                    }
                    if (type === 'timequantum') {
                      return <Form.Item 
                        name='ttl'
                        noStyle={true}
                        shouldUpdate={true}
                      >
                        <Select style={{ width: '100%' }}>
                          {AUTO_DESTROY.map(it => <Option value={it.code}>{it.name}</Option>)}
                        </Select>
                      </Form.Item>;
                    }
                    if (type === 'time') {
                      return <Form.Item 
                        name='destroyAt'
                        noStyle={true}
                        shouldUpdate={true}
                      >
                        <DatePicker format='YYYY-MM-DD HH:mm' showTime={{ format: 'HH:mm' }}/>
                      </Form.Item>;
                    }
                  }}
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label='密钥：'
            name='keyId'
          >
            <Select 
              allowClear={true}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              placeholder='请选择密钥'
              style={{ width: '80%' }}
            >
              {keys.map(it => <Option value={it.id}>{it.name}</Option>)}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item 
            style={{ marginBottom: 0 }}
            {...PL}
          >
            <Form.Item 
              noStyle={true}
              shouldUpdate={true}
            >
              {({ getFieldValue }) => {
                return <Form.Item
                  name='triggers'
                  style={{ marginBottom: 0 }}
                  {...PL}
                >
                  <Checkbox.Group style={{ width: '100%' }}>
                    <Row>
                      <Col span={8} style={{ paddingLeft: 'calc(3% - 3px)' }}>
                        <Checkbox value='commit'>每次推送到该分支时自动重新部署  </Checkbox> 
                      </Col>
                      <Col span={8} style={{ paddingLeft: 'calc(3% - 3px)' }} >
                        <Checkbox value='commit'>执行失败时，间隔 <Form.Item
                          noStyle={true}
                          name='num111'
                        ><InputNumber style={{ width: 50 }} /></Form.Item> 秒自动重试 <Form.Item
                          noStyle={true}
                          name='num222'
                        ><InputNumber style={{ width: 50 }} /></Form.Item> 次 </Checkbox> 
                      </Col>
                      <Col span={8} style={{ paddingLeft: 'calc(3% - 3px)' }} >
                        <Checkbox value='commit'>合规不通过时中止部署  </Checkbox> 
                      </Col>
                      <Col span={8} style={{ paddingLeft: 'calc(3% - 3px)', paddingTop: 20 }}>
                        <Checkbox value='prmr'>该分支提交PR/MR时自动执行plan计划  </Checkbox> 
                      </Col>
                      <Col span={8} style={{ paddingLeft: 'calc(3% - 3px)', paddingTop: 20 }}>
                        <Checkbox value='autoApproval'>自动通过审批</Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>;
              
              }}
            </Form.Item>
          </Form.Item>
        </Col>
      </Row>
    </>;
  };
  
  return (
    <Form
      scrollToFirstError={true}
      colon={true}
      form={form}
      {...FL}
      layout={'vertical'}
      initialValues={info}
    >
      <Collapse activekey={activekey} expandIconPosition={'right'} onChange={(e) => {
        setActivekey(e); 
      }} style={{ marginBottom: 20 }}
      >
        <Panel header='高级设置' key={'open'}>
          {renderForm()}
        </Panel>
      </Collapse>
    </Form>
  );
};

export default Index;
