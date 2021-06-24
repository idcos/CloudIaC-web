import React, { useState, useEffect } from 'react';
import { Space, Radio, Select, Form, Input, Button, InputNumber, notification, Row, Col } from "antd";

import { ctAPI, sysAPI } from 'services/base';
import history from 'utils/history';

const FL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
const { Option } = Select;

export default ({ stepHelper, selection, curOrg, vcsId }) => {

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
      const res = await sysAPI.listCTRunner({ orgId: curOrg.id });
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
        orgId: curOrg.id,
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
        orgId: curOrg.id,
        vcsId,
        defaultRunnerServiceId: ctServiceId,
        defaultRunnerAddr: Address,
        defaultRunnerPort: Port
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setSubmitLoading(false);
      history.push(`/org/${curOrg.guid}/ct`);
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

  return <div className='step2'>
    <Form
      form={form}
      {...FL}
      layout='vertical'
      onFinish={onFinish}
      initialValues={{
        timeout: 300,
        saveState: false
      }}
    >
      <Form.Item
        label='云模板名称'
        name='name'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input placeholder='请输入云模板名称' />
      </Form.Item>
      <Form.Item
        label='描述'
        name='description'
        rules={[
          {
            message: '请输入'
          }
        ]}
      >
        <Input.TextArea placeholder='请输入描述' />
      </Form.Item>
      <Form.Item
        label='选择分支'
        name='repoBranch'
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
      >
        <Select 
          placeholder='请选择分支'
        >
          {repoBranches.map(it => <Option value={it.name}>{it.name}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item
        label='保存状态'
        name='saveState'
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
        extra='terraform不保存状态反复运行有极大的概率出现资源名字/IP地址冲突
        ansible面向配置的目标做实时校验，状态是否保存不影响，可反复运行'
      >
        <Radio.Group>
          <Radio value={false}>不保存</Radio>
          <Radio value={true}>保存</Radio>
        </Radio.Group>
      </Form.Item>
      <Row>
        <Col span={12}>
          <Form.Item label='运行超时' required={true}>
            <Space>
              <Form.Item
                name='timeout'
                rules={[
                  {
                    required: true,
                    message: '请输入'
                  }
                ]}
                style={{ display: 'inline-block' }}
              >
                <InputNumber min={0}/>
              </Form.Item>
              <Form.Item
                style={{ display: 'inline-block' }}
              >
                秒
              </Form.Item>
            </Space>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label='默认ct-runner'
            name='ctServiceId'
          >
            <Select 
              placeholder='请选择ct-runner' allowClear={true}
            >
              {ctRunnerList.map(it => <Option value={it.ID}>{it.Tags.join() || it.ID}</Option>)}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Space>
        <Button onClick={() => stepHelper.prev()} disabled={submitLoading}>上一步</Button>
        <Button type='primary' htmlType={'submit'} loading={submitLoading}>完成</Button>
      </Space>
    </Form>
  </div>;
};
