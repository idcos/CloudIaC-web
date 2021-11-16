import React, { useState, useEffect, useImperativeHandle } from "react";
import { Tooltip, Select, Form, Input, Collapse, Checkbox, DatePicker, Row, Col, InputNumber, Space } from "antd";
import { InfoCircleOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { AUTO_DESTROY, destoryType } from 'constants/types';
import vcsAPI from 'services/vcs';
import ViewFileModal from 'components/view-file-modal';
import isEmpty from "lodash/isEmpty";
import omit from "lodash/omit";

const FL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
const { Option } = Select;
  
const Index = ({ configRef, data, orgId, tplInfo, envId, runnner, keys, tfvars, playbooks }) => {
  const { vcsId, repoId, repoRevision } = tplInfo;
  const [form] = Form.useForm();
  const { Panel } = Collapse;
  const [ activeKey, setActiveKey] = useState([]);
  const [ fileView, setFileView ] = useState({
    title: '',
    visible: false,
    content: ''
  });

  useEffect(() => {
    if (envId) {
      setFormValues(data);
    } else {
      setFormValues(tplInfo);
    }
  }, [ envId, data, tplInfo ]);

  // 策略组选项查询
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
    } else if ((data.ttl === '' || data.ttl === null || data.ttl == 0) && !data.autoDestroyAt) {
      data.type = 'infinite';
    } else if (!data.autoDestroyAt) {
      data.type = 'timequantum';
    }
    form.setFieldsValue(data);
  };

  const onfinish = async() => {
    let values = await form.validateFields().catch(() => {
      setActiveKey(['open']); // 表单报错展开折叠面板
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
    return omit(values, [ 'commit', 'prmr', 'type' ]);
  };

  // 新建时给runnerId赋值
  const setRunnerValue = (v) => {
    form.setFieldsValue({ runnerId: v });
  };

  useImperativeHandle(configRef, () => ({
    onfinish,
    setRunnerValue
  }), [ onfinish, setRunnerValue ]);

  const renderForm = () => {
    return <>
      <Row style={{ height: '100%' }} justify='space-between' style={{ marginBottom: 24 }}>
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
            label={<span>target：<Tooltip title='Target是指通过资源定位来对指定的资源进行部署，如果制定了资源名称或路径，则Terraform在执行时将仅生成包含制定资源的计划，并仅针对该计划进行部署'><InfoCircleOutlined /></Tooltip></span>}
            name='targets'
          >
            <Input placeholder={'请输入target'} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
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
          <Form.Item
            label='密钥：'
            name='keyId'
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
          <Form.Item shouldUpdate={true}>
            <Form.Item 
              name='commit'
              noStyle={true}
              valuePropName='checked'
              initialValue={false}
            >
              <Checkbox>推送到分支时重新部署</Checkbox> 
            </Form.Item>
            <Tooltip title='勾选该选项将自动调用VCS API设置webhook，请确保VCS配置中的token具有足够权限'><InfoCircleOutlined /></Tooltip>
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
          <Form.Item 
            name='stopOnViolation'
            valuePropName='checked'
            initialValue={false}
          >
            <Checkbox>合规不通过时中止部署</Checkbox> 
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
          <Form.Item 
            name='autoApproval'
            valuePropName='checked'
            initialValue={false}
          >
            <Checkbox>自动通过审批</Checkbox> 
          </Form.Item>
        </Col>
        <Col span={7}></Col>
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
    >
      <Collapse 
        expandIconPosition={'right'} 
        activeKey={activeKey} 
        onChange={setActiveKey}
        style={{ marginBottom: 20 }}
      >
        <Panel header='高级设置' forceRender={true} key='open'>
          {renderForm()}
        </Panel>
      </Collapse>
      <ViewFileModal {...fileView} onClose={onCloseViewFileModal}/>
    </Form>
  );
};

export default Index;
