import React, { useState, useEffect } from 'react';
import { Form, Card, Input, notification, Button, Select, Spin } from 'antd';
import { orgsAPI, sysAPI } from 'services/base';

const { Option } = Select;

const FL = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

export default ({ title, curOrg, dispatch }) => {

  const [ spinning, setSpinning ] = useState(false);
  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [ ctRunnerList, setCtRunnerList ] = useState([]);
  const [ info, setInfo ] = useState({});

  const [form] = Form.useForm();

  useEffect(() => {
    fetchInfo();
    fetchCTRunner();
  }, []);

  useEffect(() => {
    const { name, id, description, defaultRunnerServiceId } = info || {};
    form.setFieldsValue({ name, id, description, defaultRunnerServiceId: defaultRunnerServiceId || null });
  }, [info]);

  const fetchInfo = async () => {
    try {
      setSpinning(true);
      const res = await orgsAPI.detail(curOrg.id);
      setSpinning(false);
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setInfo(res.result || {});
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

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

  const onFinish = async (values) => {
    try {
      const { defaultRunnerServiceId, ...restValues } = values;
      const ctInfo = ctRunnerList.find((it) => it.ID == defaultRunnerServiceId) || {};
      const { Port, Address } = ctInfo;
      setSubmitLoading(true);
      const res = await orgsAPI.edit({
        ...restValues,
        id: curOrg.id,
        defaultRunnerServiceId,
        defaultRunnerAddr: Address,
        defaultRunnerPort: Port
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      dispatch({
        type: 'global/getOrgs'
      });
      setSubmitLoading(false);
      notification.success({
        message: '操作成功'
      });
      fetchInfo();
    } catch (e) {
      setSubmitLoading(false);
      notification.error({
        message: e.message
      });
    }
  };

  
  return <div>
    <Card
      title={title}
    >
      <Spin spinning={spinning}>
        <Form
          {...FL}
          layout='vertical'
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label='组织ID'
            name='id'
            rules={[
              {
                required: true,
                message: '请输入'
              }
            ]}
          >
            <Input placeholder='请输入云模板名称' disabled={true}/>
          </Form.Item>
          <Form.Item
            label='组织名称'
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
            label='默认ct-runner'
            name='defaultRunnerServiceId'
            rules={[{ required: true, message: "请选择" }]}
          >
            <Select 
              getPopupContainer={triggerNode => triggerNode.parentNode}
              placeholder='请选择ct-runner'
            >
              {ctRunnerList.map((it) => (
                <Option value={it.ID}>{it.Tags.join() || it.ID}</Option>
              ))}
            </Select>
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
            <Input.TextArea placeholder='请输入云模板名称' />
          </Form.Item>
          <Button type='primary' htmlType={'submit'} loading={submitLoading}>更改信息</Button>
        </Form>
      </Spin>
    </Card>
  </div>;
};
