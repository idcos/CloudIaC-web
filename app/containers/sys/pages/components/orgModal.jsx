import React, { useState, useEffect } from 'react';
import { Form, Input, Modal } from 'antd';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
};

export default ({ visible, toggleVisible, operation, opt, curRecord }) => {
  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (opt === 'edit') {
      form.setFieldsValue(curRecord);
    }
  }, []);

  const onOk = async () => {
    const values = await form.validateFields();
    setSubmitLoading(true);
    operation({
      doWhat: opt,
      payload: values
    }, (hasError) => {
      setSubmitLoading(false);
      !hasError && toggleVisible();
    });
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
        label='组织描述'
        name='description'
      >
        <Input.TextArea rows={8} placeholder='请输入组织描述'/>
      </Form.Item>
    </Form>
  </Modal>;
};
