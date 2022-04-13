import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Space, Button, Input } from "antd";
import { t } from 'utils/i18n';

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
          label={t('define.des')}
          name='description'
          rules={[
            {
              required: true,
              message: t('define.form.input.placeholder')
            }
          ]}
        >
          <Input placeholder={t('define.form.input.placeholder')}/>
        </Form.Item>
        <Form.Item
          label={t('define.token.expiredAt')}
          name='expiredAt'
        >
          <DatePicker style={{ width: '100%' }} placeholder={t('define.form.select.placeholder')} format='YYYY-MM-DD HH:mm' showTime={{ format: 'HH:mm' }}/>
        </Form.Item>
      </Form>
      <Space style={{ height: 32, display: 'flex', justifyContent: 'flex-end', marginTop: 45 }} >
        <Button loading={submitLoading} onClick={() => toggleVisible()}>
          {t('define.ct.import.action.cancel')}
        </Button>
        <Button onClick={() => onOk()} type={'primary'}>
          {t('define.ct.import.action.ok')}
        </Button>
      </Space>
    </>
  );
};
