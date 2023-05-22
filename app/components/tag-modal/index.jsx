import React, { useState } from 'react';
import { Form, Input, Modal, Space } from 'antd';
import { t } from 'utils/i18n';

const FL = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};

const TagModal = props => {
  const { visible, opt, toggleVisible, operation, curRecord } = props;
  const [submitLoading, setSubmitLoading] = useState(false);

  const [form] = Form.useForm();

  const onOk = async () => {
    const values = await form.validateFields();
    setSubmitLoading(true);
    operation(
      {
        action: opt,
        payload: {
          ...values,
        },
      },
      hasError => {
        setSubmitLoading(false);
        if (!hasError) {
          toggleVisible();
        }
      },
    );
  };
  return (
    <Modal
      title={
        opt === 'add' ? t('define.tag.action.add') : t('define.tag.action.edit')
      }
      visible={visible}
      onCancel={toggleVisible}
      okButtonProps={{
        loading: submitLoading,
      }}
      className='antd-modal-type-form'
      width={560}
      cancelButtonProps={{
        className: 'ant-btn-tertiary',
      }}
      onOk={onOk}
    >
      <Form {...FL} form={form} initialValues={curRecord}>
        <Form.Item label={t('define.tag')} style={{ marginBottom: 0 }}>
          <Space>
            <Form.Item
              name='key'
              rules={[
                {
                  required: true,
                  message: t('define.tag.form.key.placeholder'),
                },
              ]}
            >
              <Input
                style={{
                  width: 150,
                }}
                placeholder={t('define.tag.form.key.placeholder')}
                onBlur={e =>
                  form.setFieldsValue({ key: e.target.value.trim() })
                }
              />
            </Form.Item>

            <Form.Item
              name='value'
              rules={[
                {
                  message: t('define.tag.form.value.placeholder'),
                },
              ]}
            >
              <Input
                style={{
                  width: 240,
                }}
                placeholder={t('define.tag.form.value.placeholder')}
                onBlur={e =>
                  form.setFieldsValue({ value: e.target.value.trim() })
                }
              />
            </Form.Item>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TagModal;
