import React, { useState, useEffect, useMemo, useRef } from "react";
import { notification, Tooltip, Select, Form, Input, Button, Checkbox, Space, DatePicker, Row, Col, Radio } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import PageHeader from "components/pageHeader";
import history from 'utils/history';

import VariableForm from 'components/variable-form';
import AdvancedConfig from './advanced-config';
import Layout from "components/common/layout";
import moment from 'moment';
import { AUTO_DESTROY, destoryType } from 'constants/types';

import sysAPI from 'services/sys';
import envAPI from 'services/env';
import tplAPI from 'services/tpl';
import keysAPI from 'services/keys';
import vcsAPI from 'services/vcs';
import varsAPI from 'services/variables';
import isEmpty from "lodash/isEmpty";
import styles from './style.less';
import { data } from "vfile";

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
  const configRef = useRef({});
  const [form] = Form.useForm();

  const [ applyLoading, setApplyLoading ] = useState(false);
  const [ planLoading, setPlanLoading ] = useState(false);
  const [ vars, setVars ] = useState([]);
  const [ runnner, setRunnner ] = useState([]);
  const [ keys, setKeys ] = useState([]);
  const [ branch, setBranch ] = useState([]);
  const [ tag, setTag ] = useState([]);
  const [ info, setInfo ] = useState({});
  const [ tplInfo, setTplInfo ] = useState({});
  const [ tfvars, setTfvars ] = useState([]);
  const [ playbooks, setPlaybooks ] = useState([]);
  
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

  const getVars = async () => {
    try {
      const res = await varsAPI.search({ orgId, projectId, tplId, envId, scope: 'env' });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setVars(res.result || []);
    } catch (e) {
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
        form.setFieldsValue(data);
        setInfo(data);
      }
      const res = await tplAPI.detail({
        orgId, tplId
      });
      const tplInfoRes = res.result || {};
      setTplInfo(tplInfoRes);
      const { vcsId, repoId, repoRevision } = tplInfoRes;
      fetchTfvars(tplInfoRes);
      fetchPlaybooks(tplInfoRes);
      // 获取分支数据
      const branchRes = await vcsAPI.listRepoBranch({
        orgId, 
        vcsId, 
        repoId,
        currentPage: 1,
        pageSize: 100000
      });
      if (branchRes.code === 200) {
        setBranch(branchRes.result || []);
      }
      
      // 获取标签数据
      const tagsRes = await vcsAPI.listRepoTag({
        orgId, 
        vcsId, 
        repoId,
        currentPage: 1,
        pageSize: 100000
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
        !envId && runnerList.length && configRef.current.setRunnerValue(runnerList[0].ID);
      }
      // 获取密钥数据
      const keysRes = await keysAPI.list({
        orgId,
        pageSize: 99999,
        currentPage: 1
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


  const fetchTfvars = async (fetchParams) => {
    const { orgId, repoRevision, repoId, repoType, vcsId } = fetchParams;
    const params = { orgId, repoRevision, repoId, repoType, vcsId };
    try {
      const res = await vcsAPI.listTfvars(params);
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setTfvars(res.result || []);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };
  const fetchPlaybooks = async (fetchParams) => {
    const { orgId, repoRevision, repoId, repoType, vcsId } = fetchParams;
    const params = { orgId, repoRevision, repoId, repoType, vcsId };
    try {
      const res = await vcsAPI.listPlaybook(params);
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setPlaybooks(res.result || []);
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
      const configData = await configRef.current.onfinish();
      // if (varData.playbook && !values.keyId) {
      //   return notification.error({
      //     message: '保存失败',
      //     description: 'playbook存在时管理密钥必填'
      //   });
      // }
      values.autoApproval = (values.triggers || []).indexOf('autoApproval') !== -1;
      values.triggers = (values.triggers || []).filter(d => d !== 'autoApproval'); 
      taskType === 'plan' && setPlanLoading(true);
      taskType === 'apply' && setApplyLoading(true);
      if (!!values.destroyAt) {
        values.destroyAt = moment(values.destroyAt);
      }
      if (values.type === 'infinite') {
        values.ttl = '0';
      }
      delete values.type;
      const res = await envAPI[!!envId ? 'envRedeploy' : 'createEnv']({ orgId, projectId, ...varData, ...values, tplId, taskType, envId: envId ? envId : undefined, ...configData });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      notification.success({
        description: '保存成功'
      });
      const envInfo = res.result || {};
      if (envId) { // 重新部署环境，跳部署历史详情
        history.push(`/org/${orgId}/project/${projectId}/m-project-env/detail/${envInfo.id}/deployHistory/task/${envInfo.taskId}`); 
      } else { // 创建部署环境，跳环境详情
        history.push(`/org/${orgId}/project/${projectId}/m-project-env/detail/${envInfo.id}/deployJournal`); 
      }
      taskType === 'plan' && setPlanLoading(false);
      taskType === 'apply' && setApplyLoading(false);
    } catch (e) {
      taskType === 'plan' && setPlanLoading(false);
      taskType === 'apply' && setApplyLoading(false);
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
          scrollToFirstError={true}
          colon={true}
          form={form}
          {...FL}
          layout={'vertical'}
          initialValues={info}
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
                initialValue={info.name || undefined}
              >
                <Input value={info.name} placeholder={'请输入环境名称'} style={{ width: '80%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label='分支/标签：'
                name='revision'
              >
                <Select 
                  allowClear={true}
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
          </Row>
          <AdvancedConfig
            configRef={configRef}
            isCollapse={true}
            data={info}
            orgId={orgId}
            projectId={projectId}
            envId={envId}
            runnner={runnner}
            keys={keys}
            tfvars={tfvars}
            playbooks={playbooks}
          />
          <VariableForm
            varRef={varRef} 
            defaultScope='env' 
            defaultData={{ variables: vars }} 
            fetchParams={varFetchParams}
            canImportTerraformVar={true}
          />
          <Row style={{ display: 'flex', justifyContent: 'center' }}>
            <Button htmlType='submit' disabled={applyLoading} loading={planLoading} onClick={() => onFinish('plan')} style={{ marginTop: 20 }} >Plan计划</Button>
            <Button htmlType='submit' disabled={planLoading} loading={applyLoading} onClick={() => onFinish('apply')} style={{ marginTop: 20, marginLeft: 20 }} type='primary' >执行部署</Button>
          </Row>
        </Form>
      </div>
    </Layout>
  );
};

export default Index;
