import React, { useState, useEffect, memo, useContext } from 'react';
import { InputNumber, Card, DatePicker, Select, Form, Space, Tooltip, Button, Checkbox, Popover, notification, Row, Col, Tabs, Input, Switch, Modal } from "antd";
import { InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import queryString from 'query-string';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import cgroupsAPI from 'services/cgroups';
import getPermission from "utils/permission";
import { Eb_WP } from 'components/error-boundary';
import { AUTO_DESTROY, destoryType } from 'constants/types';
import envAPI from 'services/env';
import vcsAPI from 'services/vcs';
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
  // 此处需要用window.location获取最新的参数, 因为环境详情的location只做参数切换并不会刷新location值不刷新
  const { formTab } = queryString.parse(window.location.search); 
  const { PROJECT_OPERATOR } = getPermission(userInfo);
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
                          <Copy disabled={!PROJECT_OPERATOR || !getFieldValue('commit')} copyRequest={() => copyRequest()}/>
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
                          <Copy disabled={!PROJECT_OPERATOR || !getFieldValue('prmr')} copyRequest={() => copyRequest()}/>
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
                            label='绑定合规策略组'
                            name='policyGroup'
                            rules={[{ required: true, message: '请选择' }]}
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
                          >
                            <Checkbox>分支推送时自动检测合规</Checkbox>                  
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
                          >
                            <Checkbox>自动纠漂</Checkbox>                  
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
