import React, { useState } from 'react';
import { Form, Button, Input } from 'antd';
import { t } from 'utils/i18n';

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};

const Pwd = ({ title, userInfo, updateUserInfo }) => {
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
    >
      <Form.Item
        label={t('define.page.userSet.pwd.field.oldPassword')}
        name='oldPassword'
        rules={[
          {
            required: true,
            message: t('define.form.input.placeholder')
          }
        ]}
      >
        <Input.Password autoComplete='new-password'/>
      </Form.Item>
      <Form.Item
        label={t('define.page.userSet.pwd.field.newPassword')}
        name='newPassword'
        rules={[
          {
            required: true,
            message: t('define.form.input.placeholder')
          }
        ]}
      >
        <Input.Password autoComplete='new-password'/>
      </Form.Item>
      <Form.Item
        label={t('define.page.userSet.pwd.field.reNewPassword')}
        name='reNewPassword'
        dependencies={['newPassword']}
        hasFeedback={true}
        rules={[
          {
            required: true,
            message: t('define.form.input.placeholder')
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(t('define.page.userSet.pwd.field.reNewPassword.error.noSame')));
            }
          })
        ]}
      >
        <Input.Password autoComplete='new-password'/>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type='primary' htmlType='submit' loading={submitLoading}>
          {t('define.page.userSet.pwd.action.save')}
        </Button>
      </Form.Item>
    </Form>
  </div>;
};

export default Pwd;
