import React, { useState, useEffect } from 'react';
import { Modal, Form, Input } from "antd";

import { ctAPI } from "services/base";

const FL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

export default (props) => {

  const { visible, id, orgId, onClose } = props;

  const [form] = Form.useForm();

  const [ confirmLoading, setConfirmLoading ] = useState(false);

  const onCancel = () => {
    reset();
    onClose();
  };

  const onOk = async () => {
    const values = await form.validateFields();
    const { name } = values;
    setConfirmLoading(true);
    const res = await ctAPI.createCTByLib({
      orgId, id, name
    });
    setConfirmLoading(false);
    console.log(res);
    reset();
    onClose();
  };

  const reset = () => {
    form.resetFields();
  };

  return (
    <Modal 
      title='创建web集群云模板' 
      width={427} 
      visible={visible} 
      onCancel={onCancel} 
      onOk={onOk}
      confirmLoading={confirmLoading}
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