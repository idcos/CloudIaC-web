import React, { useState, useEffect } from 'react';
import { Space, Radio, Select, Form, Input, Button, Empty, notification, Row, Col } from "antd";

import { ctAPI } from 'services/base';
import vcsAPI from 'services/vcs';

import history from 'utils/history';
import OpModal from 'components/vcs-modal';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 }
};
const { Option, OptGroup } = Select;

export default ({ stepHelper, orgId, ctData, type }) => {

  const [form] = Form.useForm();

  const [ vcsVisible, setVcsVisible ] = useState(false);
  const [ repoBranches, setRepoBranches ] = useState([]);
  const [ repoTags, setRepoTags ] = useState([]);
  const [ repos, setRepos ] = useState([]);
  const [ vcsList, setVcsList ] = useState([]);
  
  useEffect(() => {
    fetchVcsList();
  }, []);

  useEffect(() => {
    const formData = ctData[type] || {};
    form.setFieldsValue(formData);
    if (formData.vcsId) {
      fetchRepos(formData);
    }
    if (formData.repoId) {
      fetchRepoBranches(formData);
      fetchRepoTags(formData);
    }
  }, [ ctData, type ]);

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
      fetchRepos(allValues);
    }
    if (changedValues.repoId) {
      fetchRepoBranches(allValues);
      fetchRepoTags(allValues);
    }
  };

  const onFinish = (values) => {
    stepHelper.updateData({
      type, 
      data: values
    });
    stepHelper.next();
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
          {repos.map(it => <Option value={it.id}>{it.name}</Option>)}
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
      <Form.Item wrapperCol={{ offset: 5, span: 14 }}>
        <Space size={24}>
          <Button onClick={() => stepHelper.prev()}>上一步</Button>
          <Button type='primary' htmlType={'submit'}>下一步</Button>
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
