import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, notification, Select } from 'antd';

import { sysAPI } from 'services/base';

const { Option } = Select;

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
};

export default ({ visible, toggleVisible, operation, opt }) => {
  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [ ctRunnerList, setCtRunnerList ] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCTRunner();
  }, []);

  const onOk = async () => {
    const values = await form.validateFields();
    const { ctServiceId, ...restValues } = values;
    const ctInfo = ctRunnerList.find(it => it.ID == ctServiceId) || {};
    const { Port, Address } = ctInfo;
    setSubmitLoading(true);
    operation({
      doWhat: opt,
      payload: {
        ...restValues,
        defaultRunnerServiceId: ctServiceId,
        defaultRunnerAddr: Address,
        defaultRunnerPort: Port
      }
    }, (hasError) => {
      setSubmitLoading(false);
      !hasError && toggleVisible();
    });
  };

  const fetchCTRunner = async () => {
    try {
      const res = await sysAPI.listCTRunner({});
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

  return <Modal
    title={`${opt == 'add' ? '创建' : '编辑'}组织`}
    visible={visible}
    onCancel={toggleVisible}
    okButtonProps={{
      loading: submitLoading
    }}
    onOk={onOk}
  >
    <Form
      {...FL}
      form={form}
    >
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
        <Input placeholder='请输入组织名称'/>
      </Form.Item>
      <Form.Item
        label='CT Runner'
        name='ctServiceId'
        rules={[
          {
            required: true,
            message: '请选择CT Runner'
          }
        ]}
      >
        <Select placeholder='请选择CT Runner'>
          {ctRunnerList.map(it => <Option value={it.ID}>{it.Service}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item
        label='组织描述'
        name='description'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input.TextArea placeholder='请输入组织描述'/>
      </Form.Item>
    </Form>
  </Modal>;
};
