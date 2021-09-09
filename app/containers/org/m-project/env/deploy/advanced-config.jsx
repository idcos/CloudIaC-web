import React, { useState, useEffect, useImperativeHandle } from "react";
import { notification, Tooltip, Select, Form, Input, Collapse, Checkbox, DatePicker, Row, Col, Radio, InputNumber } from "antd";
import { InfoCircleOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { AUTO_DESTROY, destoryType } from 'constants/types';
import vcsAPI from 'services/vcs';
import ViewFileModal from 'components/view-file-modal';
import styles from './style.less';

const FL = {
  labelCol: { span: 22, offset: 2 },
  wrapperCol: { span: 22, offset: 2 }
};
const PL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
const { Option } = Select;
  
const Index = ({ configRef, isCollapse, data, orgId, tplInfo, envId, runnner, keys, tfvars, playbooks }) => {
  const { vcsId, repoId, repoRevision } = tplInfo;
  const [form] = Form.useForm();
  const { Panel } = Collapse;
  const [ activekey, setActivekey ] = useState([]);
  const [ fileView, setFileView ] = useState({
    title: '',
    visible: false,
    content: ''
  });

  useEffect(() => {
    fetchInfo();
  }, [data]);

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
  
  const setTtl = (data) => {
    if (data.autoApproval) {
      data.triggers = (data.triggers || []).concat(['autoApproval']);
    }
    if (data.stopOnViolation) {
      data.triggers = (data.triggers || []).concat(['stopOnViolation']);
    }
    if (data.retryAble) {
      data.triggers = (data.triggers || []).concat(['retryAble']);
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
    console.log(values, 'values');
    return values;
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
              {runnner.map(it => <Option value={it.ID}>{it.ID}</Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={
              <>
                tfvars文件：
                <EyeOutlined 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => viewFile('tfvars')}
                />
              </>
            }
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
        <Col span={24} className={styles.noStepInput}>
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
                        <Checkbox value='retryAble'>执行失败时，间隔 <Form.Item
                          noStyle={true}
                          name='retryDelay'
                        ><InputNumber min={0} step={1} precision={0} style={{ width: 50 }} /></Form.Item> 秒自动重试 <Form.Item
                          noStyle={true}
                          name='retryNumber'
                        ><InputNumber min={0} step={1} precision={0} style={{ width: 50 }} /></Form.Item> 次 </Checkbox> 
                      </Col>
                      <Col span={8} style={{ paddingLeft: 'calc(3% - 3px)' }} >
                        <Checkbox value='stopOnViolation'>合规不通过时中止部署  </Checkbox> 
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
    >
      <Collapse activekey={activekey} expandIconPosition={'right'} onChange={(e) => {
        setActivekey(e); 
      }} style={{ marginBottom: 20 }}
      >
        <Panel header='高级设置' key={'open'}>
          {renderForm()}
        </Panel>
      </Collapse>
      <ViewFileModal {...fileView} onClose={onCloseViewFileModal}/>
    </Form>
  );
};

export default Index;
