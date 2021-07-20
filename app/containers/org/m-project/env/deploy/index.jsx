import React, { useState, useEffect, useMemo, useRef } from "react";
import { notification, Tooltip, Select, Form, Input, Button, Checkbox, Space, DatePicker, Row, Col, Radio } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import PageHeader from "components/pageHeader";
import history from 'utils/history';

import VariableForm from 'components/variable-form';
import Layout from "components/common/layout";
import moment from 'moment';
import { AUTO_DESTROY, destoryType } from 'constants/types';

import { envAPI, ctAPI, sysAPI } from 'services/base';
import varsAPI from 'services/variables';
import isEmpty from "lodash/isEmpty";

const FL = {
  labelCol: { span: 22, offset: 2 },
  wrapperCol: { span: 22, offset: 2 }
};
const PL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
const { Option, OptGroup } = Select;
const {} = Radio;
  
const Index = ({ match = {} }) => {
  const { orgId, projectId, envId, tplId } = match.params || {};
  const varRef = useRef();
  const [form] = Form.useForm();

  const [ spinning, setSpinning ] = useState(false);
  const [ vars, setVars ] = useState([]);
  const [ branch, setBranch ] = useState([]);
  const [ tag, setTag ] = useState([]);
  const [ runnner, setRunnner ] = useState([]);
  const [ keys, setKeys ] = useState([]);
  const [ info, setInfo ] = useState({});
  const [ tplInfo, setTplInfo ] = useState({});
  
  useEffect(() => {
    fetchInfo();
    getVars();
  }, []);

  const varFetchParams = useMemo(() => {
    if (isEmpty(tplInfo)) {
      return null;
    }
    return {
      orgId, ...tplInfo
    };
  }, [tplInfo]);

  const varDefaultData = useMemo(() => {
    if (envId) { // 编辑时
      return { 
        variables: vars,
        tfVarsFile: info.tfVarsFile, 
        playbook: info.playbook
      };
    } else { // 新增时
      return { 
        variables: vars,
        tfVarsFile: tplInfo.tfVarsFile, 
        playbook: tplInfo.playbook
      };
    }
  }, [ tplInfo, info, vars ]);

  const getVars = async () => {
    try {
      const res = await varsAPI.search({ orgId, projectId, tplId, envId, scope: 'env' });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setVars(res.result || []);
      setSpinning(false);
    } catch (e) {
      setSpinning(false);
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };
  // 获取Info
  const fetchInfo = async () => {
    try {
      if (envId) {
        const infores = await envAPI.envsInfo({
          orgId, projectId, envId
        });
        let data = infores.result || {};
        if (data.autoApproval) {
          data.triggers = (data.triggers || []).concat(['autoApproval']);
        }
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
      }
      const res = await envAPI.templateDetail({
        orgId, templateId: tplId
      });
      const tplInfoRes = res.result || {};
      setTplInfo(tplInfoRes);
      const { vcsId, repoId, repoRevision } = tplInfoRes;
      !envId && !!repoRevision && form.setFieldsValue({ revision: repoRevision });
      // 获取分支数据
      const branchRes = await ctAPI.listRepoBranch({
        orgId, vcsId, repoId 
      });
      if (branchRes.code === 200) {
        setBranch(branchRes.result || []);
      }
      
      // 获取标签数据
      const tagsRes = await ctAPI.listRepoTag({
        orgId, vcsId, repoId 
      });
      
      if (tagsRes.code === 200) {
        setTag(tagsRes.result || []);
      }
      // 获取通道数据
      const runnerRes = await sysAPI.listCTRunner({
        orgId
      });
      let runnerList = runnerRes.result || [];
      if (runnerRes.code === 200) {
        setRunnner(runnerList);
        !envId && runnerList.length && form.setFieldsValue({ runnerId: runnerList[0].ID });
      }
      // 获取密钥数据
      const keysRes = await envAPI.keysList({
        orgId
      });
      if (keysRes.code === 200) {
        setKeys(keysRes.result.list || []);
      }
      if (res.code != 200) {
        throw new Error(res.message);
      }
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };


  const onFinish = async (taskType) => {
    try {
      const values = await form.validateFields();
      const varData = await varRef.current.validateForm();
      if (values.triggers) {
        values.autoApproval = values.triggers.indexOf('autoApproval') !== -1 ? true : undefined;
        values.triggers = values.triggers.filter(d => d !== 'autoApproval'); 
      }
      setSpinning(true);
      if (!!values.destroyAt) {
        values.destroyAt = moment(values.destroyAt).format('YYYY-MM-DD HH:mm');
      }
      if (values.type === 'infinite') {
        values.ttl = '';
      }
      delete values.type;
      delete values.xxx;
      const res = await envAPI[!!envId ? 'envRedeploy' : 'createEnv']({ orgId, projectId, ...varData, ...values, tplId, taskType, envId: envId ? envId : undefined });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      notification.success({
        description: '保存成功'
      });
      history.push(`/org/${orgId}/project/${projectId}/m-project-env/detail/${(res.result || {}).id}/deploy`); 

      setSpinning(false);
      getVars();
    } catch (e) {
      setSpinning(false);
      notification.error({
        message: '保存失败',
        description: e.message
      });
    }
  };

  return (
    <Layout
      extraHeader={<PageHeader title={!!envId ? '重新部署' : '部署新环境'} breadcrumb={true} />}
    >
      <div className='idcos-card'>
        <Form
          colon={true}
          form={form}
          {...FL}
          onFinish={onFinish}
          layout={'vertical'}
          initialValues={info}
        >
          <Row>
            <Col span={8}>
              <Form.Item
                label='环境名称:'
                name='name'
                rules={[
                  {
                    required: true,
                    message: '请输入'
                  }
                ]}
                initialValue={info.name || undefined}
                // initialValue={'false'}
              >
                <Input value={info.name} placeholder={'请输入环境名称'} style={{ width: '80%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              {/* <Form.Item
                label='生命周期:'
                name='ttl'
              >
                <Select 
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placeholder='请选择生命周期'
                  style={{ width: '80%' }}
                  dropdownRender={menu => (
                    <div>
                      {menu}
                      <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                        <DatePicker placeholder={'自定义日期'}/>
                      </div>
                    </div>
                  )}
                >
                  {AUTO_DESTROY.map(it => <Option value={it.code}>{it.name}</Option>)}
                </Select>
              </Form.Item> */}
              <Form.Item 
                name='xxx'
                label='存活时间'
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
                label={<span>target:<Tooltip title='Target是指通过资源定位来对指定的资源进行部署，如果制定了资源名称或路径，则Terraform在执行时将仅生成包含制定资源的计划，并仅针对该计划进行部署'><InfoCircleOutlined /></Tooltip></span>}
                name='target'
              >
                <Input placeholder={'请输入target'} style={{ width: '80%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item
                label='分支/标签'
                name='revision'
              >
                <Select 
                  // getPopupContainer={triggerNode => triggerNode.parentNode}
                  placeholder='请选择分支/标签'
                  style={{ width: '80%' }}
                >
                  <OptGroup label='分支'>
                    {branch.map(it => <Option value={it.name}>{it.name}</Option>)}
                  </OptGroup>
                  <OptGroup label='标签'>
                    {tag.map(it => <Option value={it.name}>{it.name}</Option>)}
                  </OptGroup>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label='部署通道:'
                name='runnerId'
              >
                <Select 
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placeholder='请选择部署通道'
                  style={{ width: '80%' }}
                >
                  {runnner.map(it => <Option value={it.ID}>{it.Service}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label='密钥:'
                name='keyId'
              >
                <Select 
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placeholder='请选择密钥'
                  style={{ width: '80%' }}
                >
                  {keys.map(it => <Option value={it.id}>{it.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
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
                      <Col span={8} style={{ paddingLeft: '3%' }}>
                        <Checkbox value='commit'>每次推送到该分支时自动重新部署  </Checkbox> 
                        <Tooltip title='勾选该选项后CloudIaC会创建一个hook url，您可以在稍后创建的环境详情->『设置』标签中复制该url，并将其配置到您的代码仓库的webhook中，以便您将代码推送到分支时对环境进行持续部署'><InfoCircleOutlined /></Tooltip>  
                      </Col>
                      <Col span={8} style={{ paddingLeft: '3%' }}>
                        <Checkbox value='prmr'>该分支提交PR/MR时自动执行plan计划  </Checkbox> 
                        <Tooltip title='勾选该选项后CloudIaC会创建一个hook url，您可以在稍后创建的环境详情->勾选该选项后CloudIaC会创建一个hook url，您可以在稍后创建的环境详情->『设置』标签中复制该url，并将其配置到您的代码仓库的webhook中，以便您在提交PR/MR时执行预览计划'><InfoCircleOutlined /></Tooltip>  
                      </Col>
                      <Col span={8} style={{ paddingLeft: '3%' }}>
                        <Checkbox value='autoApproval'>自动通过审批</Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>;
              
              }}
            </Form.Item>
          </Form.Item>
          {/* <Form.Item
            name='triggers'
            {...PL}
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                <Col span={8} style={{ paddingLeft: '3%' }}>
                  <Checkbox value='commit'>每次推送到该分支时自动重新部署  </Checkbox> <Tooltip title='勾选该选项后CloudIaC会创建一个hook url，您可以在稍后创建的环境详情->『设置』标签中复制该url，并将其配置到您的代码仓库的webhook中，以便您将代码推送到分支时对环境进行持续部署'><InfoCircleOutlined /></Tooltip>  {(form.getFieldValue('triggers') || []).includes('commit') && <a onClick={() => copyToUrl()}>复制URL</a>}
                </Col>
                <Col span={8} style={{ paddingLeft: '3%' }}>
                  <Checkbox value='prmr'>该分支提交PR/MR时自动执行plan计划  </Checkbox> <Tooltip title='勾选该选项后CloudIaC会创建一个hook url，您可以在稍后创建的环境详情->勾选该选项后CloudIaC会创建一个hook url，您可以在稍后创建的环境详情->『设置』标签中复制该url，并将其配置到您的代码仓库的webhook中，以便您在提交PR/MR时执行预览计划'><InfoCircleOutlined /></Tooltip>  <a>复制URL</a>
                </Col>
                <Col span={8} style={{ paddingLeft: '3%' }}>
                  <Checkbox value='autoApproval'>自动通过审批</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item> */}
          <VariableForm 
            varRef={varRef} 
            defaultScope='env' 
            defaultData={varDefaultData} 
            fetchParams={varFetchParams}
            canImportTerraformVar={true}
            showOtherVars={true}
          />
          <Row style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={() => onFinish('plan')} style={{ marginTop: 20 }} >Plan计划</Button>
            <Button loading={spinning} onClick={() => onFinish('apply')} style={{ marginTop: 20, marginLeft: 20 }} type='primary' >执行部署</Button>
          </Row>
        </Form>
      </div>
    </Layout>
  );
};

export default Index;
