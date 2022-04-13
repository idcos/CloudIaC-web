import React, { useState } from 'react';
import { Form, Button, Input } from 'antd';
import { t } from 'utils/i18n';

const layout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  }
};

const Basic = ({ title, userInfo, updateUserInfo }) => {
  const [ submitLoading, setSubmitLoading ] = useState(false);

  const onFinish = (values) => {
    setSubmitLoading(true);
    updateUserInfo({
      payload: values,
      cb: () => {
        setSubmitLoading(false);
      }
    });
  };

  return <div style={{ width: 600, margin: '40px auto' }}>
    <Form
      {...layout}
      onFinish={onFinish}
      initialValues={{
        ...userInfo
      }}
    >
      <Form.Item
        name='name'
        label={t('define.page.userSet.basic.field.name')}
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
        label={t('define.page.userSet.basic.field.email')}
        name='email'
        rules={[
          {
            required: true,
            message: t('define.form.input.placeholder')
          },
          { type: 'email', message: t('define.form.error.format') }
        ]}
        extra={t('define.page.userSet.basic.field.email.extra')}
      >
        <Input placeholder={t('define.form.input.placeholder')} disabled={true}/>
      </Form.Item>
      <Form.Item
        label={t('define.page.userSet.basic.field.phone')}
        name='phone'
        rules={[{ pattern: /^1[3456789]\d{9}$/, message: t('define.form.error.format') }]}
      >
        <Input placeholder={t('define.form.input.placeholder')}/>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type='primary' htmlType='submit' loading={submitLoading}>
          {t('define.page.userSet.basic.action.save')}
        </Button>
      </Form.Item>
    </Form>
  </div>;
};

export default Basic;
