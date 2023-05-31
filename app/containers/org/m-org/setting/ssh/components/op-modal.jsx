import React, { useState } from 'react';
import { Form, Modal, Input } from 'antd';
import { t } from 'utils/i18n';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

const OpModal = ({ visible, toggleVisible, operation }) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = Form.useForm();

  const onOk = async () => {
    const values = await form.validateFields();
    setSubmitLoading(true);
    operation(
      {
        doWhat: 'add',
        payload: {
          ...values,
        },
      },
      hasError => {
        setSubmitLoading(false);
        !hasError && toggleVisible();
      },
    );
  };

  return (
    <Modal
      title={t('define.ssh.action.add')}
      visible={visible}
      onCancel={toggleVisible}
      okButtonProps={{
        loading: submitLoading,
      }}
      cancelButtonProps={{
        className: 'ant-btn-tertiary',
      }}
      className='antd-modal-type-form'
      onOk={onOk}
    >
      <Form {...FL} form={form}>
        <Form.Item
          label={t('define.ssh.name')}
          name='name'
          rules={[
            {
              required: true,
              message: t('define.form.input.placeholder'),
            },
          ]}
        >
          <Input placeholder={t('define.form.input.placeholder')} />
        </Form.Item>
        <Form.Item
          label={t('define.ssh.privateKey')}
          name='key'
          rules={[
            {
              required: true,
              message: t('define.form.input.placeholder'),
            },
          ]}
        >
          <Input.TextArea
            placeholder={t('define.form.input.placeholder')}
            rows={8}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OpModal;
