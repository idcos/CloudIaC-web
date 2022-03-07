import React, { useState, useEffect, useImperativeHandle, useCallback } from "react";
import { Tooltip, Select, Form, Input, Collapse, Checkbox, DatePicker, Row, Col, InputNumber, Space, Tabs, Switch, Modal, Popover } from "antd";
import { InfoCircleOutlined, EyeOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { AUTO_DESTROY, destoryType } from 'constants/types';
import vcsAPI from 'services/vcs';
import cgroupsAPI from 'services/cgroups';
import ViewFileModal from 'components/view-file-modal';
import isEmpty from "lodash/isEmpty";
import omit from "lodash/omit";
import styles from '../detail/styles.less';

const FL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const PL = {
  wrapperCol: { span: 24 }
};
const { Option } = Select;

const Index = ({ configRef, data, orgId, tplInfo, envId, runnner, keys, tfvars, playbooks }) => {
  const { vcsId, repoId, repoRevision } = tplInfo;
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
    if (envId) {
      setFormValues(data);
    } else {
      setFormValues(tplInfo);
    }
  }, [ envId, data, tplInfo ]);

  const { run: fetchFile } = useRequest(
    (fileName) => requestWrapper(
      vcsAPI.file.bind(null, { orgId, vcsId, repoId, branch: repoRevision, fileName })
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
    if (!!data.autoDestroyAt) {
      data.type = 'time';
      form.setFieldsValue({ destroyAt: moment(data.autoDestroyAt) });
    } else if (((data.ttl === '' || data.ttl === null || data.ttl == 0) && !data.autoDestroyAt || !envId)) {
      data.type = 'infinite';
    } else if (!data.autoDestroyAt) {
      data.type = 'timequantum';
    }
    form.setFieldsValue(data);
  };

  const onfinish = () => {
    return new Promise(async (resolve, reject) => {
      try {
        let values = await form.validateFields().catch((res) => {
          setActiveKey(['open']); // 表单报错展开折叠面板
          reject(res);
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

  // 新建时给runnerId赋值
  const setRunnerValue = (v) => {
    form.setFieldsValue({ runnerId: v });
  };

  useImperativeHandle(configRef, () => ({
    onfinish,
    setRunnerValue
  }), [ onfinish, setRunnerValue ]);

  const checkedChange = (e, str) => {
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

  return (
    <Form
      scrollToFirstError={true}
      colon={true}
      form={form}
      {...FL}
    >
      <Collapse 
        expandIconPosition={'right'} 
        activeKey={activeKey} 
        onChange={setActiveKey}
        style={{ marginBottom: 20 }}
      >
        <Panel header='高级设置' forceRender={true} key='open'>
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
                  tab={'模板'}
                  key={'tpl'}
                  forceRender={true}
                >
                  <Row style={{ height: '100%', marginBottom: 24 }} justify='space-between'>
                    <Col span={7}>
                      <Form.Item
                        label={
                          <>
                            tfvars文件：
                            <EyeOutlined 
                              style={{ cursor: 'pointer' }} 
                              onClick={() => viewFile('tfVarsFile')}
                            />
                          </>
                        }
                        name='tfVarsFile'
                      >
                        <Select
                          getPopupContainer={triggerNode => triggerNode.parentNode} 
                          allowClear={true} 
                          placeholder='请选择tfvars文件'
                          style={{ width: '100%' }}
                        >
                          {tfvars.map(it => <Option value={it}>{it}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        label={
                          <>
                            playbook文件：
                            <EyeOutlined
                              style={{ cursor: 'pointer' }} 
                              onClick={() => viewFile('playbook')}
                            />
                          </>
                        }
                        name='playbook'
                      >
                        <Select 
                          allowClear={true}
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                          placeholder='请选择playbook文件'
                          style={{ width: '100%' }}
                        >
                          {playbooks.map(it => <Option value={it}>{it}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        label='密钥：'
                        name='keyId'
                        dependencies={['playbook']}
                        rules={[
                          (form) => {
                            const playbook = form.getFieldValue('playbook');
                            return {
                              required: !!playbook,
                              message: '请选择密钥'
                            };
                          }
                        ]}
                      >
                        <Select 
                          allowClear={true}
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                          placeholder='请选择密钥'
                          style={{ width: '100%' }}
                        >
                          {keys.map(it => <Option value={it.id}>{it.name}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        label={<span>target：<Tooltip title='Target是指通过资源定位来对指定的资源进行部署，如果制定了资源名称或路径，则Terraform在执行时将仅生成包含制定资源的计划，并仅针对该计划进行部署'><InfoCircleOutlined /></Tooltip></span>}
                        name='targets'
                      >
                        <Input placeholder={'请输入target'} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Tabs.TabPane>
                <Tabs.TabPane
                  tab={'执行'}
                  key={'execute'}
                  forceRender={true}
                >
                  <Row style={{ height: '100%', marginBottom: 24 }} justify='space-between'>
                    <Col span={7}>
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
                          style={{ width: '100%' }}
                        >
                          {runnner.map(it => <Option value={it.ID}>{it.ID}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
        
        
                    <Col span={7}>
                      <Form.Item 
                        style={{ marginBottom: 0 }}
                        label='存活时间：'
                      >
                        <Row>
                          <Col span={8} className={styles.survivalTimeRight}>
                            <Form.Item 
                              name='type'
                              initialValue={'infinite'}
                            >
                              <Select style={{ width: '100%' }}>
                                {destoryType.map(d => <Option value={d.value}>{d.name}</Option>)}
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
                      <Form.Item
                        label={' '}
                      >
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
                          <Checkbox onChange={e => checkedChange(e, '推送到分支时重新部署')}>推送到分支时重新部署</Checkbox> 
                        </Form.Item>
                        <Tooltip title='勾选该选项将自动调用VCS API设置webhook，请确保VCS配置中的token具有足够权限'><InfoCircleOutlined /></Tooltip>
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
                          <Checkbox>PR/MR时执行PLAN</Checkbox> 
                        </Form.Item>
                        <Tooltip title='勾选该选项将自动调用VCS API设置webhook，请确保VCS配置中的token具有足够权限'><InfoCircleOutlined /></Tooltip>
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
                    <Col span={12}>
                      <Form.Item
                        label='开启合规检测'
                        name='policyEnable'
                        valuePropName='checked'
                        initialValue={false}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Switch />
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
                                label='绑定策略组'
                                name='policyGroup'
                                rules={[{ required: true, message: '请绑定策略组' }]}
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
                                  placeholder='请选择策略组'
                                />
                              </Form.Item>
                              <Form.Item
                                name='stopOnViolation'
                                wrapperCol={{ offset: 6, span: 16 }}
                                valuePropName='checked'
                                initialValue={false}
                                className='ant-form-item-no-min-height'
                              >
                                <Checkbox>合规不通过时中止部署</Checkbox>                  
                              </Form.Item>
                            </>
                          ) : null;
                        }}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label='开启漂移检测'
                        name='openCronDrift'
                        valuePropName='checked'
                        initialValue={false}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Switch />
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
                                label='定时检测' 
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
                                          message: '请输入crontab表达式'
                                        }
                                      ]}
                                    >
                                      <Input placeholder={'*/10 * * * * 代表每隔10分钟执行一次'} /> 
                                    </Form.Item>
                                  </Col>
                                  <Col flex={2}>
                                    <Popover
                                      placement='topRight'
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
                                <Checkbox onChange={e => checkedChange(e, '自动纠正漂移')}>自动纠漂</Checkbox>                  
                              </Form.Item>
                            </>
                          ) : null;
                        }}
                      </Form.Item>
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
          </div>
        </Panel>
      </Collapse>
      <ViewFileModal {...fileView} onClose={onCloseViewFileModal}/>
    </Form>
  );
};

export default Index;
