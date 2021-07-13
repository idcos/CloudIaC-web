import React, { useState, useEffect } from 'react';
import { Space, Radio, Select, Form, Input, Button, Empty, notification, Row, Col } from "antd";

import { ctAPI, sysAPI } from 'services/base';
import history from 'utils/history';
import OpModal from 'components/vcs-modal';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 }
};
const { Option } = Select;

export default ({ stepHelper, selection, orgId, vcsId }) => {

  const [form] = Form.useForm();

  const { selectedRows } = selection;
  const [ repoBranches, setRepoBranches ] = useState([]),
    [ ctRunnerList, setCtRunnerList ] = useState([]),
    [ vcsVisible, setVcsVisible ] = useState(false),
    [ submitLoading, setSubmitLoading ] = useState(false);
  
  useEffect(() => {
    if (selectedRows && selectedRows[0]) {
      fetchRepoBranch();
      fetchCTRunner();
    }
  }, [selectedRows]);

  const operation = async ({ doWhat, payload }, cb) => {
    try {
      const method = {
        add: (param) => ctAPI.createVcs(param)
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
      fetchRepoBranch();
      cb && cb();
    } catch (e) {
      cb && cb(e);
      notification.error({
        message: '操作失败',
        description: e.message
      });
    }
  };

  const fetchCTRunner = async () => {
    try {
      const res = await sysAPI.listCTRunner({ orgId });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setCtRunnerList(res.result || []);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const fetchRepoBranch = async () => {
    try {
      const res = await ctAPI.listRepoBranch({
        repoId: selectedRows[0].id,
        orgId,
        vcsId
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setRepoBranches(res.result || []);
    } catch (e) {
      console.log(e);
      notification.error({
        message: '获取仓库分支失败',
        description: e.message
      });
    }
  };

  const onFinish = async (values) => {
    try {
      setSubmitLoading(true);
      const { ctServiceId, ...restValues } = values;
      const ctInfo = ctRunnerList.find(it => it.ID == ctServiceId) || {};
      const { Port, Address } = ctInfo;
      const res = await ctAPI.createCt({
        ...restValues,
        repoId: selectedRows[0].id,
        repoAddr: selectedRows[0].http_url_to_repo,
        orgId,
        vcsId,
        defaultRunnerServiceId: ctServiceId,
        defaultRunnerAddr: Address,
        defaultRunnerPort: Port
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setSubmitLoading(false);
      notification.success({
        message: '创建成功'
      });
    } catch (e) {
      setSubmitLoading(false);
      notification.error({
        message: e.message
      });
    }
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

  return <div className='form-wrapper'>
    <Form
      form={form}
      {...FL}
      onFinish={onFinish}
    >
      <Form.Item
        label='vcs'
        name='repoBranch'
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
          {[].map(it => <Option value={it.name}>{it.name}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item
        label='仓库名称'
        name='repoBranch'
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
      >
        <Select 
          getPopupContainer={triggerNode => triggerNode.parentNode}
          placeholder='请选择分支'
        >
          {repoBranches.map(it => <Option value={it.name}>{it.name}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item
        label='分支/标签'
        name='repoBranch'
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
      >
        <Select 
          getPopupContainer={triggerNode => triggerNode.parentNode}
          placeholder='请选择分支'
        >
          {repoBranches.map(it => <Option value={it.name}>{it.name}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item
        label='工作目录'
        name='repoBranch'
      >
        <Select 
          getPopupContainer={triggerNode => triggerNode.parentNode}
          placeholder='请选择分支'
        >
          {repoBranches.map(it => <Option value={it.name}>{it.name}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 5, span: 14 }}>
        <Button type='primary' onClick={() => stepHelper.next()}>下一步</Button>
      </Form.Item>
    </Form>
    {
      vcsVisible && <OpModal
        visible={vcsVisible}
        toggleVisible={clVcsModal}
        opt={'add'}
        reload={fetchRepoBranch}
        operation={operation}
      />
    }
  </div>;
};
