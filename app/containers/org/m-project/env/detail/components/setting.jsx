import React, { useState, useEffect, memo } from 'react';
import { InputNumber, Card, DatePicker, Select, Form, Space, Tooltip, Button, Checkbox, notification, Row, Col } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import { connect } from "react-redux";
import getPermission from "utils/permission";
import copy from 'utils/copy';
import { Eb_WP } from 'components/error-boundary';
import { AUTO_DESTROY, destoryType } from 'constants/types';
import envAPI from 'services/env';
import tokensAPI from 'services/tokens';
import Copy from 'components/copy';

const FL = {
  labelCol: { span: 22, offset: 2 },
  wrapperCol: { span: 22, offset: 2 }
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
    info && setFormValues(info);
  }, [info]);

  const setFormValues = (data) => {
    if (!isEmpty(data.triggers)) {
      data.triggers.forEach((name) => {
        data[name] = true;
      });
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
  };

  const onFinish = async () => {
    try {
      let values = await form.validateFields();
      values.triggers = [];
      if (values.commit) {
        values.triggers = values.triggers.concat(['commit']);
      }
      if (values.prmr) {
        values.triggers = values.triggers.concat(['prmr']);
      }
      if (!!values.destroyAt) {
        values.destroyAt = moment(values.destroyAt);
      }
      if (values.type === 'infinite') {
        values.ttl = '0';
      }
      setSubmitLoading(true);
      const res = await envAPI.envsEdit({ 
        orgId, 
        projectId, 
        ...omit(values, [ 'commit', 'prmr', 'type' ]), 
        envId: envId ? envId : undefined 
      });
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

  const copyRequest = (action) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await tokensAPI.getTriggerUrl({
          orgId, envId, action, projectId
        });
        if (res.code === 200) {
          if (res.result) {
            const { key } = res.result || {};
            const copyData = `${window.location.origin}/api/v1/trigger/send?token=${key}`;
            resolve(copyData);
          } else {
            const resCreat = await tokensAPI.createToken({
              orgId, envId, action, projectId
            });
            const copyData = `${window.location.origin}/api/v1/trigger/send?token=${resCreat.result.key}`;
            resolve(copyData);
          }
        }
      } catch (e) {
        reject();
        notification.error({
          message: '获取失败',
          description: e.message
        });
      }
    });
  };

  return <div>
    <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={'设置'}>
      <Form
        scrollToFirstError={true}
        colon={true}
        form={form}
        {...FL}
        layout={'vertical'}
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
          <Col span={8}>
            <Form.Item label={' '}>
              <Space>
                <Form.Item 
                  name='retryAble'
                  valuePropName='checked'
                  initialValue={false}
                  noStyle={true}
                >
                  <Checkbox/>
                </Form.Item>
                <span>执行失败时，间隔</span>
                <Form.Item 
                  name='retryDelay'
                  initialValue={0}
                  noStyle={true}
                >
                  <InputNumber className='no-step' min={0} precision={0} style={{ width: 40 }}/>
                </Form.Item>
                <span>秒自动重试</span>
                <Form.Item
                  noStyle={true}
                  initialValue={0}
                  name='retryNumber'
                >
                  <InputNumber className='no-step' min={0} precision={0} style={{ width: 40 }} />
                </Form.Item>
                <span>次</span> 
              </Space>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item 
              name='stopOnViolation'
              label={' '}
              valuePropName='checked'
              initialValue={false}
            >
              <Checkbox>合规不通过时中止部署</Checkbox> 
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item 
              shouldUpdate={true}
            >
              {({ getFieldValue }) => (
                <>
                  <Form.Item 
                    name='commit'
                    noStyle={true}
                    valuePropName='checked'
                    initialValue={false}
                  >
                    <Checkbox>推送到分支时重新部署</Checkbox> 
                  </Form.Item>
                  <Space size={8}>
                    <Tooltip title='勾选该选项将自动调用VCS API设置webhook，请确保VCS配置中的token具有足够权限'><InfoCircleOutlined /></Tooltip>
                    <Copy disabled={!getFieldValue('commit')} copyRequest={() => copyRequest('apply')}/>
                  </Space>
                </>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item 
              shouldUpdate={true}
            >
              {({ getFieldValue }) => (
                <>
                  <Form.Item 
                    noStyle={true}
                    name='prmr'
                    valuePropName='checked'
                    initialValue={false}
                  >
                    <Checkbox>PR/MR时执行PLAN</Checkbox> 
                  </Form.Item>
                  <Space size={8}>
                    <Tooltip title='勾选该选项将自动调用VCS API设置webhook，请确保VCS配置中的token具有足够权限'><InfoCircleOutlined /></Tooltip>  
                    <Copy disabled={!getFieldValue('prmr')} copyRequest={() => copyRequest('plan')}/>
                  </Space>
                </>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item 
              name='autoApproval'
              valuePropName='checked'
              initialValue={false}
            >
              <Checkbox>自动通过审批</Checkbox> 
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
