import React, { useState, useEffect, memo, useContext } from 'react';
import { InputNumber, Card, DatePicker, Select, Form, Space, Tooltip, Button, Checkbox, Popover, notification, Row, Col, Tabs, Input, Switch, Modal } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import { connect } from "react-redux";
import getPermission from "utils/permission";
import { Eb_WP } from 'components/error-boundary';
import { AUTO_DESTROY, destoryType } from 'constants/types';
import envAPI from 'services/env';
import tokensAPI from 'services/tokens';
import Copy from 'components/copy';
import DetailPageContext from '../detail-page-context';
import styles from '../styles.less';

const FL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
const { Option } = Select;
    
const Setting = () => {
  
  const [form] = Form.useForm();
  const { userInfo, envInfo, reload, orgId, projectId, envId } = useContext(DetailPageContext);
  const { PROJECT_OPERATOR } = getPermission(userInfo);
  const [ fileLoading, setFileLoading ] = useState(false);
  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [ panel, setPanel ] = useState('execute');

  useEffect(() => {
    envInfo && setFormValues(envInfo);
  }, [envInfo]);

  const setFormValues = (data) => {
    if (!isEmpty(data.triggers)) {
      data.triggers.forEach((name) => {
        data[name] = true;
      });
    }
    data.autoRepairDriftVisible = !!data.autoRepairDrift;
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
        if (res.code !== 200) {
          throw new Error(res.message);
        }
        if (res.result) {
          const { key } = res.result || {};
          const copyData = `${window.location.origin}/api/v1/trigger/send?token=${key}`;
          resolve(copyData);
        } else {
          const resCreat = await tokensAPI.createToken({
            orgId, envId, action, projectId, type: 'trigger'
          });
          if (resCreat.code !== 200) {
            throw new Error(resCreat.message);
          }
          const copyData = `${window.location.origin}/api/v1/trigger/send?token=${resCreat.result.key}`;
          resolve(copyData);
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


  const checkedChange = (e, str, type) => {
    let checked = e.target ? e.target.checked : e;
    if (checked && !form.getFieldValue('autoApproval')) {
      Modal.confirm({
        title: `开启『${str}』功能需要同时开启『自动通过审批』，否则${str}功能无法自动进行，是否继续？`,
        okText: '继续',
        cancelText: '取消',
        onOk() {
          form.setFieldsValue({ autoApproval: true });
        },
        onCancel() {
          if (str === '推送到分支时重新部署') {
            form.setFieldsValue({ commit: false });
          } else {
            form.setFieldsValue({ autoRepairDrift: false });
          }
        }
      });
    }

  };

  const autoApprovalClick = (e) => {
    if (!e.target.checked && form.getFieldValue('autoRepairDrift') || !e.target.checked && form.getFieldValue('commit')) {
      let title = `${!!form.getFieldValue('autoRepairDrift') && '自动纠正漂移' || ''}${(!!form.getFieldValue('autoRepairDrift') && !!form.getFieldValue('commit')) && '|' || ''}${!!form.getFieldValue('commit') && '推送到分支重新部署' || ''}`;
      Modal.confirm({
        title: `当前环境已开启『${title}』，如取消该选项，则『${title}』功能也将一并取消，是否继续？`,
        okText: '继续',
        cancelText: '取消',
        onOk() {
          form.setFieldsValue({ autoRepairDrift: false, commit: false });
        },
        onCancel() {
          form.setFieldsValue({ autoApproval: true });
        }
      });
    }
  };


  return <div className={styles.depolySettingDetail}>
    <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={'设置'}>
      <Form
        scrollToFirstError={true}
        colon={true}
        form={form}
        {...FL}
        layout={'vertical'}
        onFinish={onFinish}
      >
        <div>
          <Tabs
            tabBarStyle={{ backgroundColor: '#fff', marginBottom: 20 }}
            animated={false}
            activeKey={panel}
            onChange={(k) => {
              setPanel(k); 
            }}
          >
            <Tabs.TabPane
              tab={'执行'}
              key={'execute'}
              forceRender={true}
            >
              <Row style={{ height: '100%', marginBottom: 24 }} justify='space-between'>
                <Col span={7}>
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
                          <Select style={{ width: '100%' }}>
                            {destoryType.map(d => <Option value={d.value}>{d.name}</Option>)}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={16}>
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
                                <DatePicker style={{ width: '100%' }} format='YYYY-MM-DD HH:mm' showTime={{ format: 'HH:mm' }}/>
                              </Form.Item>;
                            }
                          }}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item label={' '}>
                    <Space style={{ minWidth: 340 }}>
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
                <Col span={7}>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={'CI/CD'}
              key={'deploy'}
              forceRender={true}
            >
              <Row style={{ height: '100%', marginBottom: 24 }} justify='space-between'>
                <Col span={7}>
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
                          <Checkbox onChange={e => checkedChange(e, '推送到分支时重新部署', 'commit')}>推送到分支时重新部署</Checkbox> 
                        </Form.Item>
                        <Space size={8}>
                          <Tooltip title='勾选该选项将自动调用VCS API设置webhook，请确保VCS配置中的token具有足够权限'><InfoCircleOutlined /></Tooltip>
                          <Copy disabled={!PROJECT_OPERATOR || !getFieldValue('commit')} copyRequest={() => copyRequest('apply')}/>
                        </Space>
                      </>
                    )}
                  </Form.Item>
                </Col>
                <Col span={7}>
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
                          <Copy disabled={!PROJECT_OPERATOR || !getFieldValue('prmr')} copyRequest={() => copyRequest('plan')}/>
                        </Space>
                      </>
                    )}
                  </Form.Item>
                </Col>
                <Col span={7}>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={'合规'}
              key={'compliance'}
              forceRender={true}
            >
              <Row style={{ height: '100%', marginBottom: 24 }} justify='space-between'>
                <Col span={7}>
                  <Form.Item 
                    name='stopOnViolation'
                    label={''}
                    valuePropName='checked'
                    initialValue={false}
                  >
                    <Checkbox>合规不通过时中止部署</Checkbox> 
                  </Form.Item>
                </Col>
                <Col span={7} style={{ display: 'flex' }}>
                  
                  <Form.Item 
                    noStyle={true}
                    shouldUpdate={true}
                  >
                    {({ getFieldValue }) => {
                      return <div style={{ minWidth: 360, display: 'flex' }}>
                        <Form.Item 
                          name='openCronDrift'
                          valuePropName='checked'
                          initialValue={false}
                          extra={<>
                            {getFieldValue('openCronDrift') === true && <Form.Item 
                              label={
                                <>
                                  <span>定时检测</span>
                                  <Popover
                                    content={(
                                      <>
                                        <div>最小时间单位为分钟, 支持 "分 时 日 月 周"</div>
                                        <div style={{ fontWeight: 500 }}>举例：</div>
                                        <div>
                                          1.每隔1 分钟执行一次 */1 * * * *<br/>
                                          2.每天 23点 执行一次 0 23 * * *<br/>
                                          3.每个月1号23 点执行一次 0 23 1 * *<br/>
                                          4.每天的0点、13点、18点、21点都执行一次：0 0,13,18,21 * * *<br/>
                                        </div>
                                      </>
                                    )}
                                  >
                                    <InfoCircleOutlined style={{ marginLeft: 8 }} />
                                  </Popover>
                                </>
                              }
                              name='cronDriftExpress'
                              extra={'例：*/10 * * * * 代表每隔10分钟执行一次'}
                              rules={[
                                {
                                  required: getFieldValue('openCronDrift') === true,
                                  message: '请输入crontab表达式'
                                }
                              ]}
                            >
                              <Input placeholder={'请输入crontab表达式'} /> 
                            </Form.Item>}</>}
                        >
                          <Checkbox>漂移检测</Checkbox> 
                        </Form.Item>
                        <span style={{ display: 'flex', position: 'relative', left: '-136px', height: 22, width: 160 }}>
                          { (getFieldValue('openCronDrift') === true) &&
                          <Form.Item 
                            name='autoRepairDrift'
                            valuePropName='checked'
                            initialValue={false}
                          >
                            <Switch onChange={e => checkedChange(e, '自动纠正漂移', 'openCronDrift')} /> 
                          </Form.Item>
                          }
                          { (getFieldValue('openCronDrift') === true) && <span style={{ marginTop: 6, marginLeft: 8 }}>自动纠正漂移</span>}
                        </span>
                      </div>;
                    }}
                  </Form.Item>
                </Col>
                <Col span={7}>
                </Col>
              </Row>
            </Tabs.TabPane>

            <Tabs.TabPane
              tab={'审批'}
              key={'approval'}
              forceRender={true}
            >
              <Row style={{ height: '100%', marginBottom: 24 }} justify='space-between'>
                <Col span={7}>
                  <Form.Item 
                    name='autoApproval'
                    valuePropName='checked'
                    initialValue={false}
                  >
                    <Checkbox onChange={(e => autoApprovalClick(e))}>自动通过审批</Checkbox> 
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
          </Tabs>  
        </div>
        {
          PROJECT_OPERATOR ? (
            <Row style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
              <Button loading={fileLoading} onClick={archive} disabled={envInfo.status !== 'inactive'} >归档</Button>
              <Button loading={submitLoading} type='primary' onClick={() => onFinish()} style={{ marginLeft: 20 }} >保存</Button>
            </Row>
          ) : null
        }
      </Form>
    </Card>
  </div>;
};

export default Eb_WP()(memo(Setting));
