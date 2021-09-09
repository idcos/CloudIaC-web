import React, { useState, useEffect, memo } from 'react';
import { InputNumber, Card, DatePicker, Select, Form, Tooltip, Button, Checkbox, notification, Row, Col } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from "react-redux";
import styles from '../../deploy/style.less';

import getPermission from "utils/permission";
import copy from 'utils/copy';
import { Eb_WP } from 'components/error-boundary';
import { AUTO_DESTROY, destoryType } from 'constants/types';
import envAPI from 'services/env';
import tokensAPI from 'services/tokens';


const FL = {
  labelCol: { span: 22, offset: 2 },
  wrapperCol: { span: 22, offset: 2 }
};
const PL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
const { Option } = Select;
    
const Index = (props) => {
  
  const { match, info, reload, userInfo } = props;
  const { params: { orgId, projectId, envId } } = match;
  const { PROJECT_OPERATOR } = getPermission(userInfo);


  const [ fileLoading, setFileLoading ] = useState(false);
  const [ submitLoading, setSubmitLoading ] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (info.autoApproval) {
      info.triggers = (info.triggers || []).concat(['autoApproval']);
    }
    if (info.retryAble) {
      info.retryAble = (info.retryAble || []).concat(['retryAble']);
    }
    if (info.stopOnViolation) {
      info.stopOnViolation = (info.stopOnViolation || []).concat(['stopOnViolation']);
    }
    if (!!info.autoDestroyAt) {
      info.type = 'time';
      form.setFieldsValue({ destroyAt: moment(info.autoDestroyAt) });
    } else if (info.ttl === '' || info.ttl === null || info.ttl == 0) {
      info.type = 'infinite';
      form.setFieldsValue({ ttl: '0' });
    } else {
      info.type = 'timequantum';
      form.setFieldsValue({ ttl: info.ttl });
    }
    form.setFieldsValue(info);
  }, [info]);

  const onFinish = async (taskType) => {
    try {
      const values = await form.validateFields();
      values.retryAble = values.retryAble.indexOf('retryAble') !== -1;
      values.stopOnViolation = values.stopOnViolation.indexOf('stopOnViolation') !== -1;
      if (values.triggers) {
        values.autoApproval = values.triggers.indexOf('autoApproval') !== -1;
        values.triggers = values.triggers.filter(d => d !== 'autoApproval'); 
      }
      if (values.type === 'infinite') {
        values.ttl = '0';
      }
      delete values.type;
      setSubmitLoading(true);
      const res = await envAPI.envsEdit({ orgId, projectId, ...values, envId: envId ? envId : undefined });
      setSubmitLoading(false);
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      reload();
      notification.success({
        description: '保存成功'
      });
    } catch (e) {
      setSubmitLoading(false);
      notification.error({
        message: '保存失败',
        description: e.message
      });
    }
  };

  const archive = async() => {
    try {
      setFileLoading(true);
      const res = await envAPI.envsArchive({
        orgId, projectId, envId
      });
      setFileLoading(false);
      if (res.code != 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: '操作成功'
      });
      reload();
    } catch (e) {
      setFileLoading(false);
      notification.error({
        message: '操作失败',
        description: e.message
      });
    }
  };

  const copyToUrl = async(action) => {
    try {
      const res = await tokensAPI.getTriggerUrl({
        orgId, envId, action, projectId
      });
      let data = res.result || {};
      let copyData = `${window.location.origin}/api/v1/trigger/send?token=${data.key}`;
      if (res.code === 200) {
        if (!res.result) {
          const resCreat = await tokensAPI.createToken({
            orgId, envId, action, projectId
          });
          copyData = `${window.location.origin}/api/v1/trigger/send?token=${resCreat.result.key}`;
        }
        copy(copyData);
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
        scrollToFirstError={true}
        colon={true}
        form={form}
        {...FL}
        layout={'vertical'}
        // initialValues={info}
        {...FL}
        onFinish={onFinish}
      >
        <Row>
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
          <Col span={8} className={styles.noStepInput} style={{ paddingTop: 30 }}>
            <Form.Item
              label=''
              name='retryAble'
              style={{ marginBottom: 0 }}
            >
              <Checkbox.Group style={{ width: '100%' }}>
                <Row>
                  <Col span={24} >
                    <Checkbox value='retryAble'>执行失败时，间隔 <Form.Item
                      noStyle={true}
                      name='retryDelay'
                    ><InputNumber min={0} step={1} precision={0} style={{ width: 50 }} /></Form.Item> 秒自动重试 <Form.Item
                      noStyle={true}
                      name='retryNumber'
                    ><InputNumber min={0} step={1} precision={0} style={{ width: 50 }} /></Form.Item> 次 </Checkbox> 
                    <Tooltip title='勾选该选项后CloudIaC会创建一个hook url，您可以在稍后创建的环境详情->『设置』标签中复制该url，并将其配置到您的代码仓库的webhook中，以便您将代码推送到分支时对环境进行持续部署'><InfoCircleOutlined /></Tooltip>  
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Col>
          <Col span={8} style={{ paddingTop: 30 }}>
            <Form.Item
              label=''
              name='stopOnViolation'
              style={{ marginBottom: 0 }}
            >
              <Checkbox.Group style={{ width: '100%' }}>
                <Row>
                  <Col span={24} >
                    <Checkbox value='stopOnViolation'>合规不通过时中止部署  </Checkbox> 
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ height: 32 }}>
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
                          <Tooltip title='勾选该选项后CloudIaC会创建一个hook url，您可以在稍后创建的环境详情->『设置』标签中复制该url，并将其配置到您的代码仓库的webhook中，以便您将代码推送到分支时对环境进行持续部署'><InfoCircleOutlined /></Tooltip>
                          {
                            (getFieldValue('triggers') || []).includes('commit') ? (
                              <a onClick={() => copyToUrl('apply')}>复制URL</a>
                            ) : (
                              <span style={{ color: 'rgba(0, 0, 0, 0.3)' }}>复制URL</span>
                            )
                          }
                        </Col>
                        <Col span={8} style={{ paddingLeft: 'calc(3% - 3px)' }}>
                          <Checkbox value='prmr'>该分支提交PR/MR时自动执行plan计划  </Checkbox> 
                          <Tooltip title='勾选该选项后CloudIaC会创建一个hook url，您可以在稍后创建的环境详情->『设置』标签中复制该url，并将其配置到您的代码仓库的webhook中，以便您在提交PR/MR时执行预览计划'><InfoCircleOutlined /></Tooltip>  
                          {
                            (getFieldValue('triggers') || []).includes('prmr') ? (
                              <a onClick={() => copyToUrl('plan')}>复制URL</a>
                            ) : (
                              <span style={{ color: 'rgba(0, 0, 0, 0.3)' }}>复制URL</span>
                            )
                          }
                        </Col>
                        <Col span={8} style={{ paddingLeft: 'calc(3% - 3px)' }}>
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
        {
          PROJECT_OPERATOR ? (
            <Row style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
              <Button loading={fileLoading} onClick={archive} disabled={info.status !== 'inactive'} >归档</Button>
              <Button loading={submitLoading} type='primary' onClick={() => onFinish()} style={{ marginLeft: 20 }} >保存</Button>
            </Row>
          ) : null
        }
      </Form>
    </Card>
  </div>;
};

export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS()
  };
})(
  Eb_WP()(memo(Index))
);
