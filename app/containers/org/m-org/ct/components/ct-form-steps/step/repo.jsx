import React, { useState, useEffect, useImperativeHandle, memo } from 'react';
import { Space, Select, Form, Input, Button, Empty, notification } from "antd";
import isEqual from 'lodash/isEqual';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import tplAPI from 'services/tpl';
import vcsAPI from 'services/vcs';
import OpModal from 'components/vcs-modal';
import { TFVERSION_AUTO_MATCH } from 'constants/types';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 }
};
const { Option, OptGroup } = Select;

const Repo = ({ goCTlist, childRef, stepHelper, orgId, ctData, type, opType }) => {

  const formData = ctData[type] || {};
  const [form] = Form.useForm();
  const [ vcsVisible, setVcsVisible ] = useState(false);
  const [ repoBranches, setRepoBranches ] = useState([]);
  const [ repoTags, setRepoTags ] = useState([]);
  const [ repos, setRepos ] = useState([]);
  const [ vcsList, setVcsList ] = useState([]);

  // Terraform版本选项列表
  const {
    data: tfversionOptions = []
  } = useRequest(
    () => requestWrapper(
      tplAPI.listTfversions.bind(null, { orgId })
    )
  );
  
  useEffect(() => {
    fetchVcsList();
  }, []);

  useEffect(() => {
    form.setFieldsValue(formData);
    if (formData.vcsId) {
      fetchRepos(formData);
    }
    if (formData.repoId) {
      fetchRepoBranches(formData);
      fetchRepoTags(formData);
    }
  }, [ctData, type]);

  const fetchVcsList = async () => {
    try {
      const res = await vcsAPI.searchVcs({
        orgId,
        status: 'enable',
        currentPage: 1,
        isShowDefaultVcs: true,
        pageSize: 100000
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setVcsList(res.result.list || []);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const fetchRepos = async ({ vcsId }) => {
    try {
      const res = await vcsAPI.listRepo({
        orgId,
        vcsId,
        currentPage: 1,
        pageSize: 100000
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setRepos(res.result.list || []);
    } catch (e) {
      notification.error({
        message: '获取仓库失败',
        description: e.message
      });
    }
  };

  const fetchRepoBranches = async ({ vcsId, repoId }) => {
    try {
      const res = await vcsAPI.listRepoBranch({
        orgId,
        vcsId,
        repoId,
        currentPage: 1,
        pageSize: 100000
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setRepoBranches(res.result || []);
    } catch (e) {
      notification.error({
        message: '获取仓库分支失败',
        description: e.message
      });
    }
  };

  const fetchRepoTags = async ({ vcsId, repoId }) => {
    try {
      const res = await vcsAPI.listRepoTag({
        orgId,
        vcsId,
        repoId,
        currentPage: 1,
        pageSize: 100000
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setRepoTags(res.result || []);
    } catch (e) {
      notification.error({
        message: '获取仓库标签失败',
        description: e.message
      });
    }
  };

  const vcsOperation = async ({ doWhat, payload }, cb) => {
    try {
      const method = {
        add: (param) => vcsAPI.createVcs(param)
      };
      const res = await method[doWhat]({
        orgId,
        ...payload
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: '操作成功'
      });
      cb && cb();
    } catch (e) {
      cb && cb(e);
      notification.error({
        message: '操作失败',
        description: e.message
      });
    }
  };

  const onValuesChange = (changedValues, allValues) => {
    if (changedValues.vcsId) {
      // 切换vcs需要将关联的数据源【仓库、分支、标签】清空 ，再重新查询数据源
      setRepos([]);
      setRepoBranches([]);
      setRepoTags([]);
      fetchRepos(allValues);
      form.setFieldsValue({
        repoId: undefined,
        repoRevision: undefined,
        workdir: undefined
      });
    }
    if (changedValues.repoId) {
      // 切换仓库需要将关联的数据源【分支、标签】清空 ，再重新查询数据源
      setRepoBranches([]);
      setRepoTags([]);
      fetchRepoBranches(allValues);
      fetchRepoTags(allValues);
      form.setFieldsValue({
        repoRevision: undefined,
        workdir: undefined
      });
    }
  };

  useImperativeHandle(childRef, () => ({
    onFinish: async (index) => {
      const values = await form.validateFields();
      stepHelper.updateData({
        type, 
        data: values
      });
      stepHelper.go(index);
    }
  }));

  const onFinish = (values) => {
    stepHelper.updateData({
      type, 
      data: values,
      isSubmit: opType === 'edit'
    });
    opType === 'add' && stepHelper.next();
  };

  const opVcsModal = () => {
    setVcsVisible(true);
  };
  const clVcsModal = () => {
    setVcsVisible(false);
  };
  const notFoundRender = () => {
    return <span>
      暂无数据， <a onClick={opVcsModal}>创建VCS</a>
    </span>;
  };

  return <div className='form-wrapper' style={{ width: 600 }}>
    <Form
      form={form}
      {...FL}
      onFinish={onFinish}
      onValuesChange={onValuesChange}
    >
      <Form.Item
        label='vcs'
        name='vcsId'
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
      >
        <Select 
          getPopupContainer={triggerNode => triggerNode.parentNode}
          placeholder='请选择vcs'
          showSearch={true}
          optionFilterProp='children'
          notFoundContent={<Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            imageStyle={{
              height: 60
            }}
            description={
              notFoundRender()
            }
          >
          </Empty>}
        >
          {vcsList.map(it => <Option value={it.id}>{it.name}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item
        label='仓库名称'
        name='repoId'
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
      >
        <Select 
          showSearch={true}
          optionFilterProp='children'
          getPopupContainer={triggerNode => triggerNode.parentNode}
          placeholder='请选择仓库'
        >
          {repos.map(it => <Option value={it.id}>{it.fullName}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item
        label='分支/标签'
        name='repoRevision'
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
      >
        <Select 
          showSearch={true}
          optionFilterProp='children'
          getPopupContainer={triggerNode => triggerNode.parentNode}
          placeholder='请选择分支'
        >
          <OptGroup label='分支'>
            {repoBranches.map(it => <Option value={it.name}>{it.name}</Option>)}
          </OptGroup>
          <OptGroup label='标签'>
            {repoTags.map(it => <Option value={it.name}>{it.name}</Option>)}
          </OptGroup>
        </Select>
      </Form.Item>
      <Form.Item
        label='工作目录'
        name='workdir'
      >
        <Input placeholder='请输入工作目录' />
      </Form.Item>
      <Form.Item
        label='Terraform版本'
        name='tfVersion'
        initialValue={TFVERSION_AUTO_MATCH}
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
      >
        <Select>
          <Option value={TFVERSION_AUTO_MATCH}>自动匹配</Option>
          {
            (tfversionOptions || []).map(it => <Option value={it}>{it}</Option>)
          }
          {
            (formData.tfVersion && !(tfversionOptions || []).includes(formData.tfVersion)) && (
              <Option value={formData.tfVersion}>{formData.tfVersion}</Option>
            )
          }
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 5, span: 14 }} style={{ marginBottom: 0 }}>
        <Space size={24}>
          {
            opType === 'add' ? (
              <>
                <Button onClick={() => stepHelper.prev()}>上一步</Button>
                <Button type='primary' htmlType={'submit'}>下一步</Button>
              </>
            ) : (
              <>
                <Button onClick={goCTlist}>取消</Button>
                <Button type='primary' htmlType={'submit'}>提交</Button>
              </>
            )
          }
        </Space>
      </Form.Item>
    </Form>
    {
      vcsVisible && <OpModal
        visible={vcsVisible}
        toggleVisible={clVcsModal}
        opt={'add'}
        reload={fetchVcsList}
        operation={vcsOperation}
      />
    }
  </div>;
};

export default memo(Repo, (prevProps, nextProps) => {
  const preFormData = prevProps.ctData[prevProps.type];
  const nextFormData = nextProps.ctData[nextProps.type];
  // 判断前后表单数据源值是否相等 从而避免额外渲染业务
  if (isEqual(preFormData, nextFormData)) {
    return true;
  }
  return false;
});