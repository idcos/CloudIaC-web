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
      title='添加token'
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
          label='描述'
          name='description'
          rules={[
            {
              required: true,
              message: '请输入'
            }
          ]}
        >
          <Input placeholder='请输入描述'/>
        </Form.Item>
      </Form>
    </Modal>
  );
};
