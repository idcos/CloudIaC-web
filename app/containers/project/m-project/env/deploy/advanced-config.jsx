import React, { useState, useEffect, useImperativeHandle, useCallback } from "react";
import { Tooltip, Select, Form, Input, Collapse, Checkbox, DatePicker, Row, Col, InputNumber, Space, Tabs, Switch, Modal, Popover, notification } from "antd";
import { InfoCircleFilled, InfoCircleOutlined, EyeOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { AUTO_DESTROY, destroyType } from 'constants/types';
import vcsAPI from 'services/vcs';
import cgroupsAPI from 'services/cgroups';
import ViewFileModal from 'components/view-file-modal';
import isEmpty from "lodash/isEmpty";
import sysAPI from 'services/sys';
import omit from "lodash/omit";
import get from "lodash/get";
import { t } from 'utils/i18n';
import { formatToFormData } from 'containers/sys/pages/params';
import styles from '../detail/styles.less';

const FL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
const { Option } = Select;

const Index = ({ configRef, data, orgId, tplInfo, envId, runner, keys = [], tfvars, playbooks, repoObj }) => {
  const { repoRevision, workdir } = repoObj;
  const { vcsId, repoId } = tplInfo;
  const { locked } = data;
  const [form] = Form.useForm();
  const { Panel } = Collapse;
  const [ activeKey, setActiveKey ] = useState([]);
  const [ fileView, setFileView ] = useState({
    title: '',
    visible: false,
    content: ''
  });
  const [ panel, setPanel ] = useState('tpl');

  useEffect(() => {
    if (!envId) {
      fetchSysInfo();
    }
  }, [envId]);

  useEffect(() => {
    if (!envId && runner.length) {
      form.setFieldsValue({
        runnerTags: runner.slice(0, 1)
      });
    }
  }, [ envId, runner ]);

  useEffect(() => {
    if (!envId && tplInfo.isDemo) {
      setFormValues({
        ...tplInfo,
        ttl: "12h",
        type: 'timequantum',
        autoApproval: true
      });
      return;
    }
    if (envId && data.isDemo) {
      setFormValues({
        ...data,
        ttl: "12h",
        type: 'timequantum',
        autoApproval: true
      });
      return;
    }
    let _setValue = {};
    if (envId) {
      _setValue = { ...data };
    } else {
      _setValue = { ...tplInfo };
    }
    if (!!_setValue.autoDeployCron || !!_setValue.autoDestroyCron) {
      _setValue.type = 'cycle';
    } else {
      if (!!_setValue.ttl && _setValue.ttl !== '0') {
        _setValue.type = 'timequantum';
      } else if (!!_setValue.autoDestroyAt) {
        _setValue.type = 'time';
        setFormValues({ destroyAt: moment(_setValue.autoDestroyAt) });
      } else {
        _setValue.type = 'infinite';
      }
    }
    setFormValues(_setValue);
  }, [ envId, data, tplInfo ]);

  const fetchSysInfo = async () => {
    try {
      const res = await sysAPI.paramsSearch();
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      const { TASK_STEP_TIMEOUT } = formatToFormData(res.result);
      form.setFieldsValue({
        stepTimeout: TASK_STEP_TIMEOUT ? (TASK_STEP_TIMEOUT - 0) : 0
      });
    } catch (e) {
      notification.error({
        message: t('define.message.getFail'),
        description: e.message
      });
    }
  };

  const { run: fetchFile } = useRequest(
    (fileName) => requestWrapper(
      vcsAPI.file.bind(null, { orgId, vcsId, repoId, branch: repoRevision, fileName, workdir })
    ),
    {
      manual: true,
      onSuccess: ({ content } = {}) => {
        setFileView(preValue => ({ ...preValue, content }));
      }
    }
  );

  // 策略组选项列表查询
  const { data: policiesGroupOptions = [] } = useRequest(
    () => requestWrapper(
      cgroupsAPI.list.bind(null, { pageSize: 0 }),
      {
        formatDataFn: (res) => ((res.result || {}).list || []).map(({ name, id }) => ({ label: name, value: id }))
      }
    )
  );

  const onCloseViewFileModal = () => {
    setFileView({
      title: '',
      visible: false,
      content: ''
    });
  };

  const viewFile = (formName) => {
    const fileName = form.getFieldValue(formName);
    if (fileName) {
      setFileView({
        title: fileName,
        visible: true
      });
      fetchFile(fileName);
    }
  };

  const setFormValues = (data) => {
    if (!isEmpty(data.triggers)) {
      data.triggers.forEach((name) => {
        data[name] = true;
      });
    }
    form.setFieldsValue(data);
  };

  // 根据表单错误切换tab
  const changeTabByFormError = (err) => {
    const firstErrName = get(err, 'errorFields[0].name[0]');
    switch (firstErrName) {
    case 'tfVarsFile':
    case 'playbook':
    case 'keyId':
    case 'targets':
      setPanel('tpl');
      break;
    case 'runnerTags':
    case 'type':
    case 'ttl':
    case 'destroyAt':
    case 'stepTimeout':
    case 'retryAble':
    case 'retryDelay':
    case 'retryNumber':
    case 'approval':
      setPanel('execute');
      break;
    case 'commit':
    case 'prmr':
      setPanel('deploy');
      break;
    case 'policyEnable':
    case 'policyGroup':
    case 'stopOnViolation':
    case 'openCronDrift':
    case 'cronDriftExpress':
    case 'autoRepairDrift':
      setPanel('compliance');
      break;
    default:
      break;
    }
  };

  const onfinish = () => {
    return new Promise(async (resolve, reject) => {
      try {
        let values = await form.validateFields().catch((err) => {
          setActiveKey(['open']); // 表单报错展开折叠面板
          changeTabByFormError(err);
          reject(err);
        });
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
        values.tfVarsFile = values.tfVarsFile || '';
        values.playbook = values.playbook || '';
        delete values.autoRepairDriftVisible;
        const data = omit(values, [ 'commit', 'prmr', 'type' ]);
        resolve(data);
      } catch (error) {
        reject();
      }
    });
  };

  useImperativeHandle(configRef, () => ({
    onfinish,
    validateFields: (nameList) => {
      return new Promise(async (resolve, reject) => {
        try {
          await form.validateFields(nameList).catch((err) => {
            setActiveKey(['open']); // 表单报错展开折叠面板
            changeTabByFormError(err);
            reject(err);
          });
          resolve();
        } catch (error) {
          reject();
        }
      });
    }
  }), [onfinish]);

  // 检查改变
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

  return (
    <Form
      scrollToFirstError={true}
      colon={false}
      form={form}
      {...FL}
    >
      <Collapse
        expandIconPosition={'right'}
        activeKey={activeKey}
        onChange={setActiveKey}
        style={{ marginBottom: 20 }}
      >
        <Panel header={t('define.env.deploy.advanced')} forceRender={true} key='open'>
          <div>
            <div className={styles.depolyDetail}>
              <Tabs
                type={'card'}
                tabBarStyle={{ backgroundColor: '#fff', marginBottom: 20 }}
                animated={false}
                activeKey={panel}
                onChange={(k) => {
                  setPanel(k);
                }}
              >
                <Tabs.TabPane
                  tab={t('define.env.deploy.advanced.tpl')}
                  key={'tpl'}
                  forceRender={true}
                >
                  <Row style={{ height: '100%', marginBottom: 24 }} justify='space-between'>
                    <Col span={7}>
                      <Form.Item noStyle={true} dependencies={['tfVarsFile']}>
                        {(form) => {
                          const tfVarsFile = form.getFieldValue('tfVarsFile');
                          const noOption = tfVarsFile && !tfvars.find(it => it === tfVarsFile);
                          return (
                            <Form.Item
                              rules={[
                                {
                                  validator(_, value) {
                                    if (noOption) {
                                      return Promise.reject(new Error(t('define.env.deploy.advanced.tpl.notFound.tfvarsFile')));
                                    }
                                    return Promise.resolve();
                                  }
                                }
                              ]}
                              label={
                                <>
                                  {t('define.variable.tfVarsFile')}
                                  <EyeOutlined
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => !noOption && viewFile('tfVarsFile')}
                                  />
                                </>
                              }
                              name='tfVarsFile'
                            >
                              <Select
                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                allowClear={true}
                                placeholder={t('define.form.select.placeholder')}
                                style={{ width: '100%' }}
                              >
                                {tfvars.map(it => <Option value={it}>{it}</Option>)}
                              </Select>
                            </Form.Item>
                          );
                        }}
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item noStyle={true} dependencies={['playbook']}>
                        {(form) => {
                          const playbook = form.getFieldValue('playbook');
                          const noOption = playbook && !playbooks.find(it => it === playbook);
                          return (
                            <Form.Item
                              rules={[
                                {
                                  validator(_, value) {
                                    if (noOption) {
                                      return Promise.reject(new Error(t('define.env.deploy.advanced.tpl.notFound.playbookFile')));
                                    }
                                    return Promise.resolve();
                                  }
                                }
                              ]}
                              label={
                                <>
                                  {t('define.variable.playbook')}
                                  <EyeOutlined
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => !noOption && viewFile('playbook')}
                                  />
                                </>
                              }
                              name='playbook'
                            >
                              <Select
                                allowClear={true}
                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                placeholder={t('define.form.select.placeholder')}
                                style={{ width: '100%' }}
                              >
                                {playbooks.map(it => <Option value={it}>{it}</Option>)}
                              </Select>
                            </Form.Item>
                          );
                        }}
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        label={t('define.ssh')}
                        name='keyId'
                        dependencies={['playbook']}
                        rules={[
                          (form) => {
                            const playbook = form.getFieldValue('playbook');
                            return {
                              required: !!playbook,
                              message: t('define.form.select.placeholder')
                            };
                          },
                          {
                            validator(_, value) {
                              if (value) {
                                if (!keys.find((item) => (item.id === value))) {
                                  return Promise.reject(new Error(t('define.ssh.deleted')));
                                }
                              }
                              return Promise.resolve();
                            }
                          }
                        ]}
                      >
                        <Select
                          allowClear={true}
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                          placeholder={t('define.form.select.placeholder')}
                          style={{ width: '100%' }}
                        >
                          {keys.map(it => <Option value={it.id}>{it.name}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        label={<span>Target<Tooltip title={t('define.env.field.target.tooltip')}><InfoCircleOutlined /></Tooltip></span>}
                        name='targets'
                      >
                        <Input placeholder={t('define.form.input.placeholder')} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Tabs.TabPane>
                <Tabs.TabPane
                  tab={t('define.env.deploy.advanced.execute')}
                  key={'execute'}
                  forceRender={true}
                >
                  <Row style={{ height: '100%', marginBottom: 24 }} justify='space-between'>
                    <Col span={7}>
                      <Form.Item
                        label={t('define.env.field.runnerTags')}
                        name='runnerTags'
                        rules={[
                          {
                            required: true,
                            message: t('define.form.select.placeholder')
                          },
                          {
                            validator(_, value) {
                              if (runner && runner.length) {
                                for (let i = 0; i < value.length; i++) {
                                  if (!runner.includes(value[i])) {
                                    return Promise.reject(new Error(t('define.env.deploy.advanced.execute.notFound.runnerTag')));
                                  }
                                }
                              }
                              return Promise.resolve();
                            }
                          }
                        ]}
                      >
                        <Select
                          allowClear={true}
                          placeholder={t('define.form.select.placeholder')}
                          mode='multiple'
                          style={{ width: '100%' }}
                          disabled={locked}
                        >
                          {runner.map(it => <Option value={it}>{it}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={7}>
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
                              <Select disabled={locked || (tplInfo.isDemo || data.isDemo)} style={{ width: '100%' }} onChange={value => checkedChange(value !== 'infinite', t('define.env.field.lifeTime'))}>
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
                                    <Select disabled={locked || (tplInfo.isDemo || data.isDemo)} style={{ width: '100%' }}>
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
                                    <DatePicker disabled={locked} style={{ width: '100%' }} format='YYYY-MM-DD HH:mm' showTime={{ format: 'HH:mm' }}/>
                                  </Form.Item>;
                                }
                                if (type === 'cycle') {
                                  return <div style={{
                                    marginLeft: '10px'
                                  }}
                                  >
                                    <Form.Item
                                      name='autoDeployCron'
                                      label={t('define.deploy')}
                                      style={{ marginBottom: 0 }}
                                      shouldUpdate={true}
                                      rules={[{ required: false, message: t('define.form.input.placeholder') }]}
                                    >
                                      <Input disabled={locked} placeholder={t('define.env.field.autoDeployCron.placeholder')} /> 
                                    </Form.Item>
                                    <Form.Item
                                      name='autoDestroyCron'
                                      label={t('define.destroy')}
                                      style={{ marginBottom: 0 }}
                                      shouldUpdate={true}
                                      rules={[{ required: false, message: t('define.form.input.placeholder') }]}
                                    >
                                      <Input disabled={locked} placeholder={t('define.env.field.autoDestroyCron.placeholder')} /> 
                                    </Form.Item>
                                  </div>;
                                }
                              }}
                            </Form.Item>
                          </Col>
                        </Row>
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
                              <InputNumber disabled={locked} style={{ width: '100%' }} min={0} precision={0} placeholder={t('define.form.input.placeholder')} />
                            </Form.Item>
                          </Col>
                          <Col flex='0 0 auto'>
                            <span style={{ color: '#24292F' }}>{t('define.unit.minute')}</span>
                          </Col>
                        </Row>
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item>
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
                    <Col span={7}>
                      <Form.Item
                        name='autoApproval'
                        valuePropName='checked'
                        initialValue={false}
                      >
                        <Checkbox
                          disabled={locked || (tplInfo.isDemo || data.isDemo)}
                          onChange={(e => autoApprovalClick(e.target.checked))}
                        >{t('define.autoApproval')}</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={7}></Col>
                  </Row>
                </Tabs.TabPane>
                <Tabs.TabPane
                  tab={'CI/CD'}
                  key={'deploy'}
                  forceRender={true}
                >
                  <Row style={{ height: '100%', marginBottom: 24 }} justify='space-between'>
                    <Col span={7}>
                      <Form.Item shouldUpdate={true}>
                        <Form.Item
                          name='commit'
                          noStyle={true}
                          valuePropName='checked'
                          initialValue={false}
                        >
                          <Checkbox disabled={locked} onChange={e => checkedChange(e.target.checked, t('define.env.field.triggers.commit'))}>{t('define.env.field.triggers.commit')}</Checkbox>
                        </Form.Item>
                        <Tooltip title={t('define.env.field.triggers.tooltip')}><InfoCircleOutlined /></Tooltip>
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item shouldUpdate={true}>
                        <Form.Item
                          name='prmr'
                          valuePropName='checked'
                          initialValue={false}
                          noStyle={true}
                        >
                          <Checkbox disabled={locked}>{t('define.env.field.triggers.prmr')}</Checkbox>
                        </Form.Item>
                        <Tooltip title={t('define.env.field.triggers.tooltip')}><InfoCircleOutlined /></Tooltip>
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                    </Col>
                  </Row>
                </Tabs.TabPane>
                <Tabs.TabPane
                  tab={t('define.compliance')}
                  key={'compliance'}
                  forceRender={true}
                >
                  <Row style={{ height: '100%', marginBottom: 24 }} justify='space-between'>
                    <Col span={12}>
                      <Form.Item
                        label={t('define.ct.field.policyEnable')}
                        name='policyEnable'
                        valuePropName='checked'
                        initialValue={false}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Switch disabled={locked}/>
                      </Form.Item>
                      <Form.Item
                        noStyle={true}
                        shouldUpdate={true}
                      >
                        {({ getFieldValue }) => {
                          const policyEnable = getFieldValue('policyEnable');
                          return policyEnable ? (
                            <>
                              <Form.Item
                                label={t('define.ct.field.policyGroup')}
                                name='policyGroup'
                                rules={[{ required: true, message: t('define.form.select.placeholder') }]}
                                labelCol={{ span: 6 }}
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
                                wrapperCol={{ offset: 6, span: 16 }}
                                valuePropName='checked'
                                initialValue={false}
                                className='ant-form-item-no-min-height'
                              >
                                <Checkbox disabled={locked}>{t('define.stopOnViolation')}</Checkbox>
                              </Form.Item>
                            </>
                          ) : null;
                        }}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label={t('define.env.field.openCronDrift')}
                        name='openCronDrift'
                        valuePropName='checked'
                        initialValue={false}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Switch disabled={locked} />
                      </Form.Item>
                      <Form.Item
                        noStyle={true}
                        shouldUpdate={true}
                      >
                        {({ getFieldValue }) => {
                          const openCronDrift = getFieldValue('openCronDrift');
                          return openCronDrift ? (
                            <>
                              <Form.Item
                                label={t('define.env.field.cronDriftExpress')}
                                required={true}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                              >
                                <Row>
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
                                wrapperCol={{ offset: 6, span: 16 }}
                                valuePropName='checked'
                                initialValue={false}
                                className='ant-form-item-no-min-height'
                              >
                                <Checkbox disabled={locked} onChange={e => checkedChange(e.target.checked, t('define.autoRepairDrift'))}>{t('define.autoRepairDrift')}</Checkbox>
                              </Form.Item>
                            </>
                          ) : null;
                        }}
                      </Form.Item>
                    </Col>
                  </Row>
                </Tabs.TabPane>
              </Tabs>
            </div>
          </div>
        </Panel>
      </Collapse>
      <ViewFileModal {...fileView} onClose={onCloseViewFileModal}/>
    </Form>
  );
};

export default Index;
