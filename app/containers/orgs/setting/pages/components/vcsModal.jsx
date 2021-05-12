import React, { useState } from 'react';
import { Form, Input, Modal, Select } from "antd";

const FL = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};
const { Option } = Select;

export default ({ visible, opt, toggleVisible, curRecord, operation }) => {
  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [form] = Form.useForm();

  const onOk = async () => {
    const values = await form.validateFields();
    operation({
      doWhat: opt,
      payload: {
        ...values
      }
    }, (hasError) => {
      setSubmitLoading(false);
      !hasError && toggleVisible();
    });
  };

  return <Modal
    title='添加VCS'
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
        name='vcsType'
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
      >
        <Select placeholder='请选择VCS类型'>
          <Option value='gitea'>gitea</Option>
          <Option value='gitlab'>gitlab</Option>
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
        name='vcsToken'
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
