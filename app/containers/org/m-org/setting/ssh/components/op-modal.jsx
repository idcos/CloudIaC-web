import React, { useState, useEffect } from 'react';
import { Form, Col, Modal, notification, Row, Select, Table, Input } from "antd";

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
};

export default ({ visible, toggleVisible, operation }) => {

  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [form] = Form.useForm();

  const onOk = async () => {
    const values = await form.validateFields();
    setSubmitLoading(true);
    operation({
      doWhat: 'add',
      payload: {
        ...values
      }
    }, (hasError) => {
      setSubmitLoading(false);
      !hasError && toggleVisible();
    });
  };

  return (
    <Modal
      title='添加密钥'
      visible={visible}
      onCancel={toggleVisible}
      okButtonProps={{
        loading: submitLoading
      }}
      cancelButtonProps={{ 
        className: 'ant-btn-tertiary' 
      }}
      onOk={onOk}
    >
      <Form
        {...FL}
        form={form}
      >
        <Form.Item
          label='密钥名称'
          name='name'
          rules={[
            {
              required: true,
              message: '请输入'
            }
          ]}
        >
          <Input placeholder='请输入密钥名称'/>
        </Form.Item>
        <Form.Item
          label='私钥'
          name='key'
          rules={[
            {
              required: true,
              message: '请输入'
            }
          ]}
        >
          <Input.TextArea placeholder='请输入私钥内容' rows={8} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
