import React, { useState } from 'react';
import { Form, DatePicker, Input, Modal } from 'antd';
import { t } from 'utils/i18n';

const FL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const AddModal = ({ orgId, toggleVisible, operation, visible }) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = Form.useForm();

  const onOk = async () => {
    const values = await form.validateFields();
    setSubmitLoading(true);
    operation(
      {
        doWhat: 'add',
        payload: {
          orgId,
          type: 'api',
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
      title={t('define.token.action.add')}
      visible={visible}
      onCancel={toggleVisible}
      okButtonProps={{
        loading: submitLoading,
      }}
      onOk={onOk}
    >
      <Form {...FL} form={form}>
        <Form.Item
          label={t('define.name')}
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
          label={t('define.des')}
          name='description'
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input placeholder={t('define.form.input.placeholder')} />
        </Form.Item>
        <Form.Item label={t('define.token.expiredAt')} name='expiredAt'>
          <DatePicker
            style={{ width: '100%' }}
            placeholder={t('define.form.select.placeholder')}
            format='YYYY-MM-DD HH:mm'
            showTime={{ format: 'HH:mm' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddModal;
