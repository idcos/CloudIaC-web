import React, { useState, useEffect } from 'react';
import { Modal, Form, Input } from "antd";

const FL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

export default (props) => {

  const { visible, id, onClose } = props;

  const [form] = Form.useForm();

  const onCancel = () => {
    onClose();
  };

  const onOk = async () => {
    const values = await form.validateFields();
    form.resetFields();
    onClose();
  };

  return (
    <Modal 
      width={427} title='创建web集群云模板' 
      visible={visible} onCancel={onCancel} onOk={onOk}
    >
      <Form form={form} {...FL}>
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
      </Form>
    </Modal>
  );
};