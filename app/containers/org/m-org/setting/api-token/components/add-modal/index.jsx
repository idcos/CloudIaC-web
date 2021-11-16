import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Space, Button, Input } from "antd";

const FL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

export default ({ orgId, toggleVisible, operation }) => {

  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [form] = Form.useForm();

  const onOk = async () => {
    const values = await form.validateFields();
    setSubmitLoading(true);
    operation({
      doWhat: 'add',
      payload: {
        orgId,
        type: 'api',
        ...values
      }
    }, (hasError) => {
      setSubmitLoading(false);
      !hasError && toggleVisible();
    });
  };

  return (
    <>
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
        <Form.Item
          label='过期时间'
          name='expiredAt'
        >
          <DatePicker style={{ width: '100%' }} placeholder='请选择过期时间' format='YYYY-MM-DD HH:mm' showTime={{ format: 'HH:mm' }}/>
        </Form.Item>
      </Form>
      <Space style={{ height: 32, display: 'flex', justifyContent: 'flex-end' }} >
        <Button loading={submitLoading} onClick={() => toggleVisible()}>
          取消
        </Button>
        <Button onClick={() => onOk()} type={'primary'}>
          确认
        </Button>
      </Space>
    </>
  );
};
