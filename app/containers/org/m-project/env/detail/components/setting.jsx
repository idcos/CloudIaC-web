import React, { useState, useEffect, memo } from 'react';
import { Card, DatePicker, Select, Form, Tooltip, Button, Checkbox, notification, Row, Col } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import copy from 'utils/copy';
import moment from 'moment';

import { Eb_WP } from 'components/error-boundary';
import { AUTO_DESTROY, destoryType } from 'constants/types';


import { pjtAPI, envAPI } from 'services/base';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 }
};
const PL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
const { Option } = Select;
    
const Index = (props) => {
  const { match, panel, routes } = props,
    { params: { orgId, projectId, envId } } = match;
  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [1],
      total: 0
    }),
    [ info, setInfo ] = useState({});
  const [form] = Form.useForm();

  
  const onFinish = async (taskType) => {
    try {
      const values = await form.validateFields();
      if (values.triggers) {
        values.autoApproval = values.triggers.indexOf('autoApproval') !== -1 ? true : undefined;
        values.triggers = values.triggers.filter(d => d !== 'autoApproval'); 
      }
      if (!!values.destroyAt) {
        values.destroyAt = moment(values.autoDestroyAt).format('YYYY-MM-DD HH:mm');
      }
      if (values.type === 'infinite') {
        values.ttl = '';
      }
      delete values.type;
      delete values.xxx;
      const res = await envAPI.envsEdit({ orgId, projectId, ...values, envId: envId ? envId : undefined });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      notification.success({
        description: '保存成功'
      });
    } catch (e) {
      notification.error({
        message: '保存失败',
        description: e.message
      });
    }
  };
  useEffect(() => {
    fetchInfo();
  }, []);

  const archive = async() => {
    try {
      const res = await envAPI.envsArchive({
        orgId, projectId, envId
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: '操作成功'
      });
      fetchInfo();
    } catch (e) {
      notification.error({
        message: '操作失败',
        description: e.message
      });
    }
    
  };

  const fetchInfo = async () => {
    try {
      const res = await envAPI.envsInfo({
        orgId, projectId, envId
      });
      let data = res.result || {};
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
      form.setFieldsValue(data);
      setInfo(data);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };
  const resetValue = () => {
    form.setFieldsValue({ ttl: '' });
  };

  const copyToUrl = async(action) => {
    try {
      const res = await envAPI.getTriggerUrl({
        orgId, envId, action, projectId
      });
      let data = res.result || {};
      if (res.code === 200) {
        copy(`${window.location.origin}/api/v1/trigger/send?token=${data.key}`);
      }
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };
  return <div>
    <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={'设置'}>
      <Form
        form={form}
        {...FL}
        onFinish={onFinish}
      >
        <Form.Item 
          name='triggers'
          {...PL}
        >
          <Form.Item 
            noStyle={true}
            shouldUpdate={true}
          >
            {({ getFieldValue }) => {
              return <Form.Item
                name='triggers'
                {...PL}
              >
                <Checkbox.Group style={{ width: '100%' }}>
                  <Row>
                    <Col span={8} style={{ paddingLeft: '2%' }}>
                      <Checkbox value='commit'>每次推送到该分支时自动重新部署  </Checkbox> 
                      <Tooltip title='勾选该选项后CloudIaC会创建一个hook url，您可以在稍后创建的环境详情->『设置』标签中复制该url，并将其配置到您的代码仓库的webhook中，以便您将代码推送到分支时对环境进行持续部署'><InfoCircleOutlined /></Tooltip>  {(getFieldValue('triggers') || []).includes('commit') ? <a onClick={() => copyToUrl('apply')}>复制URL</a> : <span style={{ color: 'rgba(0, 0, 0, 0.3)' }}>复制URL</span>}
                    </Col>
                    <Col span={8} style={{ paddingLeft: '2%' }}>
                      <Checkbox value='prmr'>该分支提交PR/MR时自动执行plan计划  </Checkbox> 
                      <Tooltip title='勾选该选项后CloudIaC会创建一个hook url，您可以在稍后创建的环境详情->勾选该选项后CloudIaC会创建一个hook url，您可以在稍后创建的环境详情->『设置』标签中复制该url，并将其配置到您的代码仓库的webhook中，以便您在提交PR/MR时执行预览计划'><InfoCircleOutlined /></Tooltip>  {(getFieldValue('triggers') || []).includes('prmr') ? <a onClick={() => copyToUrl('plan')}>复制URL</a> : <span style={{ color: 'rgba(0, 0, 0, 0.3)' }}>复制URL</span>}
                    </Col>
                    <Col span={8} style={{ paddingLeft: '2%' }}>
                      <Checkbox value='autoApproval'>自动通过审批</Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>;
              
            }}
          </Form.Item>
        </Form.Item>
        <Row>
          <Col span={8} style={{ marginLeft: '2%' }}>
            <Form.Item 
              name='xxx'
              label='存活时间'
              {...PL}
            >
              <Row>
                <Col span={8}>
                  <Form.Item 
                    name='type'
                    initialValue={'infinite'}
                  >
                    <Select onChange={resetValue()} style={{ width: '90%' }}>
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
        </Row>
        <Row style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={archive} >归档</Button>
          <Button type='primary' onClick={() => onFinish()} style={{ marginLeft: 20 }} >保存</Button>
        </Row>
      </Form>
    </Card>
  </div>;
};

export default Eb_WP()(memo(Index));
