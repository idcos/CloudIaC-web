import React, { useState, useEffect, memo, useContext } from 'react';
import { InputNumber, Card, DatePicker, Select, Form, Space, Tooltip, Button, Checkbox, Popover, notification, Row, Col, Tabs, Input, Switch, Modal } from "antd";
import { InfoCircleFilled, InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import queryString from 'query-string';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import cgroupsAPI from 'services/cgroups';
import getPermission from "utils/permission";
import { Eb_WP } from 'components/error-boundary';
import { AUTO_DESTROY, destroyType } from 'constants/types';
import envAPI from 'services/env';
import vcsAPI from 'services/vcs';
import Copy from 'components/copy';
import { t } from 'utils/i18n';
import DetailPageContext from '../detail-page-context';
import styles from '../styles.less';

const { confirm } = Modal;

const FL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
const { Option } = Select;
    
const Setting = () => {
  
  const [form] = Form.useForm();
  const { userInfo, envInfo, reload, orgId, projectId, envId, onUnLock, onLock } = useContext(DetailPageContext);
  const { locked, isDemo } = envInfo;
  // 此处需要用window.location获取最新的参数, 因为环境详情的location只做参数切换并不会刷新location值不刷新
  const { formTab } = queryString.parse(window.location.search); 
  const { PROJECT_OPERATOR, PROJECT_APPROVER } = getPermission(userInfo);
  const [ fileLoading, setFileLoading ] = useState(false);
  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [ panel, setPanel ] = useState(formTab || 'execute');

  useEffect(() => {
    envInfo && setFormValues(envInfo);
  }, [envInfo]);

  // 策略组选项列表查询
  const { data: policiesGroupOptions = [] } = useRequest(
    () => requestWrapper(
      cgroupsAPI.list.bind(null, { pageSize: 0 }),
      {
        formatDataFn: (res) => ((res.result || {}).list || []).map(({ name, id }) => ({ label: name, value: id }))
      }
    )
  );

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
    } else if (data.autoDeployCron || data.autoDestroyCron) {
      data.type = 'cycle';
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
        description: t('define.message.opSuccess')
      });
    } catch (e) {
      setSubmitLoading(false);
      notification.error({
        message: t('define.message.opFail'),
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
        message: t('define.message.opSuccess')
      });
      reload();
    } catch (e) {
      setFileLoading(false);
      notification.error({
        message: t('define.message.getFail'),
        description: e.message
      });
    }
  };

  const copyRequest = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await vcsAPI.getWebhook({
          orgId, envId, projectId
        });
        if (res.code !== 200) {
          throw new Error(res.message);
        }
        resolve((res.result || {}).url);
      } catch (e) {
        reject();
        notification.error({
          message: t('define.message.getFail'),
          description: e.message
        });
      }
    });
  };


  const checkedChange = (flag, str) => {
    if (flag && !form.getFieldValue('autoApproval')) {
      Modal.confirm({
        icon: <InfoCircleFilled />,
        width: 480,
        title: `${t('define.action.open')}『${str}』`,
        content: `${t('define.action.open')}『${str}』${t('define.env.deploy.needAutoApproval.confirm.content.middle')}『${str}』${t('define.env.deploy.needAutoApproval.confirm.content.suffix')}`,
        cancelButtonProps: {
          className: 'ant-btn-tertiary' 
        },
        onOk() {
          form.setFieldsValue({ autoApproval: true });
        },
        onCancel() {
          if (str === t('define.env.field.triggers.commit')) {
            form.setFieldsValue({ commit: false });
          } else if (str === t('define.autoRepairDrift')) {
            form.setFieldsValue({ autoRepairDrift: false });
          } else if (str === t('define.env.field.lifeTime')) {
            form.setFieldsValue({ type: 'infinite' });
          }
        }
      });
    }

  };

  const autoApprovalClick = (flag) => {
    const { autoRepairDrift, commit, type } = form.getFieldsValue();
    if (!flag && (autoRepairDrift || commit || type !== 'infinite')) {
      const title = [
        !!autoRepairDrift ? t('define.autoRepairDrift') : '',
        !!commit ? t('define.env.field.triggers.commit') : '',
        type !== 'infinite' ? t('define.env.field.lifeTime') : ''
      ].filter(it => !!it).join(' | ');
      Modal.confirm({
        icon: <InfoCircleFilled />,
        width: 480,
        title: `${t('define.action.close')}『${t('define.autoApproval')}』`,
        content: `${t('define.env.deploy.autoApproval.confirm.content.prefix')}『${title}』${t('define.env.deploy.autoApproval.confirm.content.middle')}『${title}』${t('define.env.deploy.autoApproval.confirm.content.suffix')}`,
        cancelButtonProps: {
          className: 'ant-btn-tertiary' 
        },
        onOk() {
          form.setFieldsValue({ autoRepairDrift: false, commit: false, type: 'infinite' });
        },
        onCancel() {
          form.setFieldsValue({ autoApproval: true });
        }
      });
    }
  };

  const showConfirm = () => {
    confirm({
      title: t('define.env.action.archive.confirm.title'),
      icon: <InfoCircleFilled />,
      content: t('define.env.action.archive.des'),
      onOk() {
        return archive();
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  };

  return <div className={styles.depolySettingDetail}>
    <div className='scroll-wrapper'>
      <Form
        scrollToFirstError={true}
        colon={true}
        form={form}
        {...FL}
        onFinish={onFinish}
      >
        <div>
          <Card
            title={t('define.env.deploy.advanced.execute')}
            key={'execute'}
            forceRender={true}
          >
            <Row style={{ height: '100%', marginBottom: 24 }} justify='space-between'>
              <Col span={8}>
                <Form.Item 
                  style={{ marginBottom: 0 }}
                  label={t('define.env.field.lifeTime')}
                >
                  <Row>
                    <Col span={8} className={styles.survivalTimeRight}>
                      <Form.Item 
                        name='type'
                        initialValue={'infinite'}
                      >
                        <Select disabled={locked || isDemo} style={{ width: '100%' }} onChange={value => checkedChange(value !== 'infinite', t('define.env.field.lifeTime'))}>
                          {destroyType.map(d => <Option value={d.value}>{d.name}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={16} className={styles.survivalTimeLeft}>
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
                              <Select disabled={locked || isDemo} style={{ width: '100%' }}>
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
                              <DatePicker disabled={locked || isDemo} style={{ width: '100%' }} format='YYYY-MM-DD HH:mm' showTime={{ format: 'HH:mm' }}/>
                            </Form.Item>;
                          }
                        }}
                      </Form.Item>

                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item 
                  shouldUpdate={true}
                  noStyle={true}
                >
                  {({ getFieldValue }) => {
                    let type = getFieldValue('type'); 
                    if (type === 'cycle') {
                      return <>
                        <Form.Item
                          label={t('define.deploy')}
                          style={{ marginBottom: 0 }}
                        >
                          <Row>
                            <Col span={18}>
                              <Form.Item
                                name='autoDeployCron'
                                rules={[{ required: true, message: t('define.form.input.placeholder') }]}
                              >
                                <Input disabled={locked} placeholder={t('define.env.field.autoDeployCron.placeholder')} /> 
                              </Form.Item> 
                            </Col>
                          </Row>
                        </Form.Item>
                        <Form.Item
                          label={t('define.destroy')}
                          style={{ marginBottom: 0 }}
                        >
                          <Row>
                            <Col span={18}>
                              <Form.Item
                                name='autoDestroyCron'
                                rules={[{ required: true, message: t('define.form.input.placeholder') }]}
                              >
                                <Input disabled={locked} placeholder={t('define.env.field.autoDestroyCron.placeholder')} /> 
                              </Form.Item> 
                            </Col>
                          </Row>
                        </Form.Item>
                      </>;
                    }
                  }}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label={t('define.env.field.stepTimeout')}
                >
                  <Row align='middle' gutter={[ 8, 0 ]}>
                    <Col flex='1'>
                      <Form.Item
                        name='stepTimeout'
                        noStyle={true}
                      >
                        <InputNumber disabled={locked} style={{ width: '100%' }} placeholder={t('define.form.input.placeholder')} />
                      </Form.Item>
                    </Col>
                    <Col flex='0 0 auto'>
                      <span style={{ color: '#24292F' }}>{t('define.unit.minute')}</span>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label={<span></span>}>
                  <Space style={{ minWidth: 340 }}>
                    <Form.Item 
                      name='retryAble'
                      valuePropName='checked'
                      initialValue={false}
                      noStyle={true}
                    >
                      <Checkbox disabled={locked}/>
                    </Form.Item>
                    <span>{t('define.env.field.retryDelay.prefix')}</span>
                    <Form.Item 
                      name='retryDelay'
                      initialValue={0}
                      noStyle={true}
                    >
                      <InputNumber disabled={locked} className='no-step' min={0} precision={0} style={{ width: 40 }}/>
                    </Form.Item>
                    <span>{t('define.env.field.retryDelay.suffix')}</span>
                    <Form.Item
                      noStyle={true}
                      initialValue={0}
                      name='retryNumber'
                    >
                      <InputNumber disabled={locked} className='no-step' min={0} precision={0} style={{ width: 40 }} />
                    </Form.Item>
                    <span>{t('define.frequency')}</span> 
                  </Space>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item 
                  name='autoApproval'
                  valuePropName='checked'
                  initialValue={false}
                >
                  <Checkbox disabled={locked || isDemo} onChange={(e => autoApprovalClick(e.target.checked))}>{t('define.autoApproval')}</Checkbox> 
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card
            title={'CI/CD'}
            key={'deploy'}
            forceRender={true}
          >
            <Row style={{ height: '100%', marginBottom: 24 }} justify='space-between'>
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
                        <Checkbox disabled={locked} onChange={e => checkedChange(e.target.checked, t('define.env.field.triggers.commit'))}>{t('define.env.field.triggers.commit')}</Checkbox> 
                      </Form.Item>
                      <Space size={8}>
                        <Tooltip title={t('define.env.field.triggers.tooltip')}><InfoCircleOutlined /></Tooltip>
                        <Copy disabled={!PROJECT_OPERATOR || !getFieldValue('commit')} copyRequest={() => copyRequest()}/>
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
                        <Checkbox disabled={locked}>{t('define.env.field.triggers.prmr')}</Checkbox> 
                      </Form.Item>
                      <Space size={8}>
                        <Tooltip title={t('define.env.field.triggers.tooltip')}><InfoCircleOutlined /></Tooltip>  
                        <Copy disabled={!PROJECT_OPERATOR || !getFieldValue('prmr')} copyRequest={() => copyRequest()}/>
                      </Space>
                    </>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
              </Col>
            </Row>
          </Card>           
          <Card
            title={t('define.compliance')}
            key={'compliance'}
            forceRender={true}
          >
            <Form.Item
              noStyle={true}
              shouldUpdate={true}
            >
              {({ getFieldsValue }) => {
                const { policyEnable, openCronDrift } = getFieldsValue();
                const isOpen = policyEnable || openCronDrift;
                const colSpan = isOpen ? 12 : 8; 
                return (
                  <Row style={{ height: '100%', marginBottom: 24 }} justify='space-between'>
                    <Col span={colSpan}>
                      <Form.Item
                        label={t('define.ct.field.policyEnable')}
                        name='policyEnable'
                        valuePropName='checked'
                        initialValue={false}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Switch disabled={locked} />
                      </Form.Item>
                      {policyEnable ? (
                        <>
                          <Form.Item
                            label={t('define.ct.field.policyGroup')}
                            name='policyGroup'
                            rules={[{ required: true, message: t('define.form.select.placeholder') }]}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                          >
                            <Select 
                              mode='multiple'
                              optionFilterProp='label'
                              showSearch={true}
                              allowClear={true}
                              showArrow={true}
                              options={policiesGroupOptions}
                              placeholder={t('define.form.select.placeholder')}
                              disabled={locked}
                            />
                          </Form.Item>
                          <Form.Item
                            name='stopOnViolation'
                            wrapperCol={{ offset: 8, span: 16 }}
                            valuePropName='checked'
                            initialValue={false}
                            className='ant-form-item-no-min-height'
                          >
                            <Checkbox disabled={locked}>{t('define.stopOnViolation')}</Checkbox>                  
                          </Form.Item>
                        </>
                      ) : null}
                    </Col>
                    <Col span={colSpan}>
                      <Form.Item
                        label={t('define.env.field.openCronDrift')}
                        name='openCronDrift'
                        valuePropName='checked'
                        initialValue={false}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Switch disabled={locked} />
                      </Form.Item>
                      {openCronDrift ? (
                        <>
                          <Form.Item 
                            label={t('define.env.field.cronDriftExpress')} 
                            required={true} 
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                          >
                            <Row wrap={false}>
                              <Col flex={16}>
                                <Form.Item 
                                  noStyle={true}
                                  name='cronDriftExpress'
                                  rules={[
                                    {
                                      required: true,
                                      message: t('define.form.input.placeholder')
                                    }
                                  ]}
                                >
                                  <Input disabled={locked} placeholder={t('define.env.field.cronDriftExpress.placeholder')} /> 
                                </Form.Item>
                              </Col>
                              <Col flex={2}>
                                <Popover
                                  placement='topRight'
                                  content={(
                                    <>
                                      <div>{t('define.env.field.cronDriftExpress.example.title')}</div>
                                      <div style={{ fontWeight: 500 }}>{t('define.env.field.cronDriftExpress.example.subTitle')}</div>
                                      <div>
                                        {t('define.env.field.cronDriftExpress.example.1')}<br/>
                                        {t('define.env.field.cronDriftExpress.example.2')}<br/>
                                        {t('define.env.field.cronDriftExpress.example.3')}<br/>
                                        {t('define.env.field.cronDriftExpress.example.4')}<br/>
                                      </div>
                                    </>
                                  )}
                                >
                                  <QuestionCircleOutlined style={{ fontSize: 16, marginLeft: 12, marginTop: 8, color: '#898989' }}/>
                                </Popover>
                              </Col>
                            </Row>
                          </Form.Item>
                          <Form.Item
                            name='autoRepairDrift'
                            wrapperCol={{ offset: 8, span: 16 }}
                            valuePropName='checked'
                            initialValue={false}
                            className='ant-form-item-no-min-height'
                          >
                            <Checkbox disabled={locked} onChange={e => checkedChange(e.target.checked, t('define.autoRepairDrift'))}>{t('define.autoRepairDrift')}</Checkbox>                  
                          </Form.Item>
                        </>
                      ) : null}
                    </Col>
                    <Col span={colSpan}></Col>
                  </Row>
                );
              }}
            </Form.Item>
          </Card>
          {
            PROJECT_OPERATOR ? (
              <Row style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
                <Button loading={submitLoading} disabled={locked} type='primary' onClick={() => onFinish()} >{t('define.action.save')}</Button>
              </Row>
            ) : null
          }
          <Card
            title={t('define.other')}
          >
            <Row justify='center' style={{ margin: '10px 0px 20px 0px' }}>
              <Col span={21}>
                <span>
                  {envInfo.locked ? t('define.env.action.unlock.des') : t('define.env.action.lock.des')}
                </span>
              </Col>
              <Col span={3} style={{ textAlign: "right" }}>
                {PROJECT_APPROVER && <div>{
                  !envInfo.locked ? (
                    <Button onClick={() => onLock('lock')} disabled={isDemo}>{t('define.env.action.lock')}</Button>
                  ) : (
                    <Button onClick={() => onUnLock()} disabled={isDemo}>{t('define.env.action.unlock')}</Button>
                  )
                }</div>}
              </Col>
            </Row>
            <hr style={{ backgroundColor: "rgba(225, 228, 232, 1)", height: "2px", border: "none" }} />
            <Row style={{ alignItems: "center", margin: '22px 0px 26px 0px' }} >
              <Col span={21} >
                <span>{t('define.env.action.archive.des')}</span>
              </Col>
              <Col span={3} style={{ textAlign: "right" }}>
                <Button loading={fileLoading} onClick={showConfirm} disabled={![ 'destroyed', 'inactive' ].includes(envInfo.status)} >{t('define.env.action.archive')}</Button>
              </Col>
            </Row>
          </Card>
        </div>
      </Form>
    </div>
  </div>;
};

export default Eb_WP()(memo(Setting));
