import React, { useState, useEffect, useRef } from "react";
import { notification, Tooltip, Select, Form, Input, Button, Checkbox, DatePicker, Row, Col } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import PageHeaderPlus from "components/pageHeaderPlus";
import VariableForm from 'components/variable-form';
import LayoutPlus from "components/common/layout/plus";
import CTFormSteps from 'components/ct-form-steps';
import moment from 'moment';
import { envAPI, ctAPI, sysAPI } from 'services/base';

import varsAPI from 'services/variables';

const FL = {
  labelCol: { span: 22, offset: 2 },
  wrapperCol: { span: 22, offset: 2 }
};
const PL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
let autoDestroy = [
  { name: '不限', code: '0', time: '0' },
  { name: '12小时', code: '12h', time: moment().add(12, "hours").format("YYYY-MM-DD HH:mm") },
  { name: '一天', code: '1d', time: moment().add(1, "days").format("YYYY-MM-DD HH:mm") },
  { name: '三天', code: '3d', time: moment().add(3, "days").format("YYYY-MM-DD HH:mm") },
  { name: '一周', code: '1w', time: moment().add(1, "weeks").format("YYYY-MM-DD HH:mm") },
  { name: '半个月', code: '15d', time: moment().add(15, "days").format("YYYY-MM-DD HH:mm") },
  { name: '一个月', code: '28/29/30/31', time: moment().add(1, "months").format("YYYY-MM-DD HH:mm") }
];
const { Option, OptGroup } = Select;
  
export default ({ match = {} }) => {
  const { orgId, projectId, envId, ctId } = match.params || {};
  const varRef = useRef();
  const [form] = Form.useForm();

  const [ spinning, setSpinning ] = useState(false);
  const [ vars, setVars ] = useState([]);
  const [ branch, setBranch ] = useState([]);
  const [ tag, setTag ] = useState([]);
  const [ runnner, setRunnner ] = useState([]);
  
  useEffect(() => {
    fetchInfo();
  }, []);
  useEffect(() => {
    getVars();
  }, []);

  const getVars = async () => {
    try {
    //   setSpinning(true);
      const res = await varsAPI.search({ orgId, projectId, tplId: ctId, scope: 'env' });
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
      const res = await envAPI.templateDetail({
        orgId, templateId: ctId
      });
      const { vcsId, repoId } = res.result || {};
      // 获取分支数据
      const branchRes = await ctAPI.listRepoBranch({
        orgId, vcsId, repoId 
      });
      if (branchRes.code === 200) {
        setBranch(branchRes.result);
      }
      // 获取标签数据
      const tagsRes = await ctAPI.listRepoTag({
        orgId, vcsId, repoId 
      });
      
      if (tagsRes.code === 200) {
        setTag(tagsRes.result);
      }
      // 获取通道数据
      const runnerRes = await sysAPI.listCTRunner({
        orgId
      });
      
      if (runnerRes.code === 200) {
        setRunnner(runnerRes.result);
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
      values.autoApproval = values.triggers.indexOf('autoApproval') !== -1 ? true : undefined;
      values.triggers = values.triggers.filter(d => d !== 'autoApproval');
      setSpinning(true);
      const res = await envAPI.createEnv({ orgId, projectId, ...varData, ...values, tplId: ctId, taskType });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      notification.success({
        description: '保存成功'
      });
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
    <LayoutPlus
      extraHeader={<PageHeaderPlus title='部署新环境' breadcrumb={true} />}
    >
      <div className='idcos-card'>
        <Form
          colon={true}
          form={form}
          {...FL}
          onFinish={onFinish}
          layout={'vertical'}
        >
          <Row>
            <Col span={8}>
              <Form.Item
                label='环境名称：'
                name='name'
                rules={[
                  {
                    required: true,
                    message: '请输入'
                  }
                ]}
              >
                <Input placeholder={'请输入环境名称'} style={{ width: '80%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label='生命周期：'
                name='autoDestroyAt'
                // rules={[
                //   {
                //     required: true,
                //     message: '请选择'
                //   }
                // ]}
              >
                <Select 
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placeholder='请选择生命周期'
                  style={{ width: '80%' }}
                  dropdownRender={menu => (
                    <div>
                      {menu}
                      {/* <Divider style={{ margin: '4px 0' }} /> */}
                      <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                        <DatePicker placeholder={'自定义日期'}/>
                      </div>
                    </div>
                  )}
                >
                  {autoDestroy.map(it => <Option value={it.code}>{it.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<span>target：<Tooltip title='Target是指通过资源定位来对指定的资源进行部署，如果制定了资源名称或路径，则Terraform在执行时将仅生成包含制定资源的计划，并仅针对该计划进行部署'><InfoCircleOutlined /></Tooltip></span>}
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
                // rules={[
                //   {
                //     required: true,
                //     message: '请选择分支/标签'
                //   }
                // ]}
              >
                <Select 
                  getPopupContainer={triggerNode => triggerNode.parentNode}
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
                label='部署通道'
                name='runnerId'
                // rules={[
                //   {
                //     required: true,
                //     message: '请选择部署通道'
                //   }
                // ]}
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
                label='密钥'
                name='miyao'
              >
                <Select 
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placeholder='请选择密钥'
                  style={{ width: '80%' }}
                >
                  {[ 1, 2, 3, 4, 5 ].map(it => <Option value={it}>{it}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name='triggers'
            {...PL}
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                <Col span={8} style={{ paddingLeft: '3%' }}>
                  <Checkbox value='commit'>每次推送到该分支时自动重新部署</Checkbox>
                </Col>
                <Col span={8} style={{ paddingLeft: '3%' }}>
                  <Checkbox value='prmr'>该分支提交PR/MR时自动执行plan计划</Checkbox>
                </Col>
                <Col span={8} style={{ paddingLeft: '3%' }}>
                  <Checkbox value='autoApproval'>自动通过审批</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <VariableForm varRef={varRef} defaultScope='env' defaultData={{ variables: vars }} showOtherVars={true}/>
          <Row style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={() => onFinish('plan')} style={{ marginTop: 20 }} >Plan计划</Button>
            <Button onClick={() => onFinish('apply')} style={{ marginTop: 20, marginLeft: 20 }} type='primary' >执行部署</Button>
          </Row>
        </Form>
      </div>
    </LayoutPlus>
  );
};
