import React, { useState } from 'react';
import { Form, Input, Modal } from 'antd';

const FL = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};

export default ({ visible, toggleVisible, operation, opt, curRecord }) => {
  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [form] = Form.useForm();

  const onOk = async () => {
    const values = await form.validateFields();
    setSubmitLoading(true);
    operation({
      doWhat: opt,
      payload: {
        ...values,
        id: curRecord && curRecord.id
      }
    }, (hasError) => {
      setSubmitLoading(false);
      !hasError && toggleVisible();
    });
  };

  return <Modal
    title={`${opt == 'add' ? '添加' : '编辑'}成员`}
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
      initialValues={curRecord}
    >
      <Form.Item
        label='邮箱'
        name='email'
        rules={[
          {
            required: true,
            message: '请输入',
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          }
        ]}
        extra='邮箱作为登录名，全局唯一'
      >
        <Input placeholder='请输入邮箱' disabled={opt === 'edit'} />
      </Form.Item>
      <Form.Item
        label='姓名'
        name='name'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input placeholder='请输入姓名'/>
      </Form.Item>
      <Form.Item
        label='手机号'
        name='phone'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input placeholder='请输入手机号'/>
      </Form.Item>
    </Form>
  </Modal>;
};
