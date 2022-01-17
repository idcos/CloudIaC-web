import React, { useState, useEffect, useMemo, useRef } from "react";
import { notification, Select, Form, Input, Button, Row, Col } from "antd";
import get from 'lodash/get';
import PageHeader from "components/pageHeader";
import history from 'utils/history';
import VariableForm, { formatVariableRequestParams } from 'components/variable-form';
import AdvancedConfig from './advanced-config';
import Layout from "components/common/layout";
import sysAPI from 'services/sys';
import envAPI from 'services/env';
import tplAPI from 'services/tpl';
import keysAPI from 'services/keys';
import vcsAPI from 'services/vcs';
import varsAPI from 'services/variables';
import isEmpty from "lodash/isEmpty";

const FL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
const { Option, OptGroup } = Select;
const defaultScope = 'env';
  
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
      ...tplInfo, orgId, projectId, envId, tplId, objectType: envId ? 'env' : 'template'
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
      fetchTfvars(tplInfoRes);
      fetchPlaybooks(tplInfoRes);
      fetchKeys(tplInfoRes);
      fetchRunner();
      fetchRepoTag(tplInfoRes);
      fetchRepoBranch(tplInfoRes);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  // 获取分支数据
  const fetchRepoBranch = async (tplInfoRes) => {
    const { vcsId, repoId, repoRevision } = tplInfoRes;
    !envId && !!repoRevision && form.setFieldsValue({ revision: repoRevision });
    try { 
      const res = await vcsAPI.listRepoBranch({
        orgId, 
        vcsId, 
        repoId
      });
      if (res.code === 200) {
        setBranch(res.result || []);
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

  // 获取标签数据
  const fetchRepoTag = async (tplInfoRes) => {
    const { vcsId, repoId } = tplInfoRes;
    try { 
      const res = await vcsAPI.listRepoTag({
        orgId, 
        vcsId, 
        repoId
      });
      
      if (res.code === 200) {
        setTag(res.result || []);
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

  // 获取通道数据
  const fetchRunner = async () => {
    try { 
      const res = await sysAPI.listCTRunner({
        orgId
      });
      let runnerList = res.result || [];
      if (res.code === 200) {
        setRunnner(runnerList);
        !envId && runnerList.length && configRef.current.setRunnerValue(runnerList[0].ID);
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
  
  // 获取密钥数据
  const fetchKeys = async (fetchParams) => {
    const { orgId, repoRevision, repoId, repoType, vcsId } = fetchParams;
    try { 
      const res = await keysAPI.list({
        orgId,
        pageSize: 0
      });
      if (res.code === 200) {
        setKeys(res.result.list || []);
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

  // 获取Tfvars文件
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

  // 获取Playbook文件
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
      const value = await form.validateFields().catch((err) => {
        const errInfo = get(err, 'errorFields[0].errors[0]', '');
        throw {
          message: '表单校验错误',
          description: errInfo
        };
      });
      const configData = await configRef.current.onfinish().catch((err) => {
        const errInfo = get(err, 'errorFields[0].errors[0]', '');
        throw {
          message: '表单校验错误',
          description: errInfo
        };
      });
      const varData = await varRef.current.validateForm().catch(() => {
        throw {
          message: '表单校验错误',
          description: '请检查变量表单填写是否有误'
        };
      });
      let values = { ...value, ...configData };
      taskType === 'plan' && setPlanLoading(true);
      taskType === 'apply' && setApplyLoading(true);
      const res = await envAPI[!!envId ? 'envRedeploy' : 'createEnv']({ orgId, projectId, ...formatVariableRequestParams(varData, defaultScope), ...values, tplId, taskType, envId: envId ? envId : undefined, ...configData });
      if (res.code !== 200) {
        throw {
          message: res.message,
          description: res.message_detail
        };
      }
      notification.success({
        message: '保存成功'
      });
      const envInfo = res.result || {};
      if (envId) { // 重新部署环境，跳部署历史详情
        history.push(`/org/${orgId}/project/${projectId}/m-project-env/detail/${envInfo.id}/task/${envInfo.taskId}`); 
      } else { // 创建部署环境，跳环境详情
        history.push(`/org/${orgId}/project/${projectId}/m-project-env/detail/${envInfo.id}?tabKey=deployJournal`); 
      }
      taskType === 'plan' && setPlanLoading(false);
      taskType === 'apply' && setApplyLoading(false);
    } catch (err) {
      taskType === 'plan' && setPlanLoading(false);
      taskType === 'apply' && setApplyLoading(false);
      notification.error(err);
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
          initialValues={info}
        >
          <Row justify='space-between' style={{ marginBottom: 24 }}>
            <Col span={7}>
              <Form.Item
                label='环境名称：'
                name='name'
                rules={[
                  {
                    required: true,
                    message: '请输入环境名称'
                  }
                ]}
                initialValue={info.name || undefined}
              >
                <Input value={info.name} placeholder={'请输入环境名称'} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                label='分支/标签：'
                name='revision'
                rules={[
                  {
                    required: true,
                    message: '请选择分支/标签'
                  }
                ]}
              >
                <Select 
                  allowClear={true}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placeholder='请选择分支/标签'
                  style={{ width: '100%' }}
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
            <Col span={7}></Col>
          </Row>
          <AdvancedConfig
            configRef={configRef}
            data={info}
            orgId={orgId}
            envId={envId}
            runnner={runnner}
            keys={keys}
            tfvars={tfvars}
            playbooks={playbooks}
            tplInfo={tplInfo}
          />
          <VariableForm
            varRef={varRef} 
            defaultScope={defaultScope}
            defaultData={{ variables: vars }} 
            fetchParams={varFetchParams}
            canImportTerraformVar={true}
            defaultExpandCollapse={false}
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
