import React, { useState } from 'react';
import { Form, Input, Modal } from 'antd';

const FL = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};

export default ({ visible, toggleVisible, curOrg, operation, opt }) => {
  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [form] = Form.useForm();

  const onOk = async () => {
    const values = await form.validateFields();
    setSubmitLoading(true);
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
    title={`${opt == 'add' ? '添加' : '编辑'}组织`}
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
