import React, { useState, useEffect } from 'react';
import { Form, Input, Modal } from 'antd';
import { t } from "utils/i18n";

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
    title={opt == 'add' ? t('define.page.sysSet.org.action.create') : t('define.page.sysSet.org.action.modify')}
    visible={visible}
    onCancel={toggleVisible}
    okButtonProps={{
      loading: submitLoading
    }}
    cancelButtonProps={{ 
      className: 'ant-btn-tertiary' 
    }}
    className='antd-modal-type-form'
    onOk={onOk}
  >
    <Form
      {...FL}
      form={form}
    >
      <Form.Item
        label={t('define.name')}
        name='name'
        getValueFromEvent={(e) => e.target.value.trim()}
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
        label={t('define.des')}
        name='description'
      >
        <Input.TextArea rows={8} placeholder={t('define.form.input.placeholder')} />
      </Form.Item>
    </Form>
  </Modal>;
};
