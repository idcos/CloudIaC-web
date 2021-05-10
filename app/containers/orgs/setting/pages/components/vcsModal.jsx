import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Select, Space, Button, Checkbox, notification } from "antd";
import { DeleteOutlined } from '@ant-design/icons';

import { sysAPI } from 'services/base';

const FL = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};
const { Option } = Select;

export default ({ visible, opt, toggleVisible, curRecord, curOrg, reload, operation }) => {
  const [ submitLoading, setSubmitLoading ] = useState(false),
    [ ctRunnerList, setCtRunnerList ] = useState([]);
  const [form] = Form.useForm();

  const onOk = async () => {
    const values = await form.validateFields();
    return console.warn('待联调接口');
    operation({
      doWhat: opt,
      payload: {
        id: curRecord && curRecord.id,
        ...values
      }
    }, (hasError) => {
      setSubmitLoading(false);
      !hasError && toggleVisible();
    });
  };

  useEffect(() => {
    fetchCTRunner();
  }, []);

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

  return <Modal
    title="添加VCS"
    visible={visible}
    onCancel={toggleVisible}
    okButtonProps={{
      loading: submitLoading
    }}
    onOk={onOk}
    width={600}
  >
    <Form
      {...FL}
      form={form}
      initialValues={curRecord}
    >
      <Form.Item
        label='名称'
        name='name'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input placeholder='请输入资源名称'/>
      </Form.Item>
      <Form.Item
        label='类型'
        name='type'
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
      >
        <Select placeholder='请选择VCS类型'>
          {ctRunnerList.map(it => <Option value={it.ID}>{it.Service}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item
        label='地址'
        name='address'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input placeholder='请输入地址'/>
      </Form.Item>
      <Form.Item
        label='Token'
        name='token'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input placeholder='请输入Token密码'/>
      </Form.Item>
    </Form>
  </Modal>;
};
