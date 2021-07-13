import React, { useState, useEffect } from 'react';
import { Space, Radio, Select, Form, Input, Button, InputNumber, notification, Row, Col } from "antd";

import { ctAPI, sysAPI } from 'services/base';
import history from 'utils/history';

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
    [ submitLoading, setSubmitLoading ] = useState(false);
  
  useEffect(() => {
    if (selectedRows && selectedRows[0]) {
      fetchRepoBranch();
      fetchCTRunner();
    }
  }, [selectedRows]);

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
      history.push(`/org/${orgId}/ct`);
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

  return <div className='form-wrapper'>
    <Form
      form={form}
      {...FL}
      onFinish={onFinish}
    >
      <Form.Item
        label='模板名称'
        name='name'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input placeholder='请输入模板名称' />
      </Form.Item>
      <Form.Item
        label='模板描述'
        name='description'
      >
        <Input.TextArea placeholder='请输入模板描述' />
      </Form.Item>
      <Form.Item
        label='关联项目'
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
          placeholder='请选择关联项目'
          mode={'multiple'}
        >
          {repoBranches.map(it => <Option value={it.name}>{it.name}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 5, span: 14 }}>
        <Button onClick={() => stepHelper.prev()} disabled={submitLoading} style={{ marginRight: 24 }}>上一步</Button>
        <Button type='primary' htmlType={'submit'} loading={submitLoading}>完成创建</Button>
      </Form.Item>
    </Form>
  </div>;
};
