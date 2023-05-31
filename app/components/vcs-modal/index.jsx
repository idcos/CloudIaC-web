import React, { useState } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { t } from 'utils/i18n';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
const { Option } = Select;

const VcsModal = ({
  visible,
  opt,
  toggleVisible,
  curRecord = {},
  operation,
}) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = Form.useForm();

  const onOk = async () => {
    const values = await form.validateFields();
    const payload = opt === 'add' ? values : { ...values, id: curRecord.id };
    operation(
      {
        doWhat: opt,
        payload,
      },
      hasError => {
        setSubmitLoading(false);
        !hasError && toggleVisible();
      },
    );
  };

  const onChangeVcsType = value => {
    switch (value) {
      case 'github':
        form.setFieldsValue({ address: 'https://api.github.com/' });
        break;
      case 'gitee':
        form.setFieldsValue({ address: 'https://gitee.com/' });
        break;
      default:
        form.setFieldsValue({ address: '' });
        break;
    }
  };

  return (
    <Modal
      title={opt === 'add' ? t('define.vcs.add') : t('define.vcs.modify')}
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
      width={550}
      zIndex={1000}
    >
      <Form {...FL} form={form} initialValues={curRecord}>
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
          label={t('define.type')}
          name='vcsType'
          rules={[
            {
              required: true,
              message: t('define.form.select.placeholder'),
            },
          ]}
        >
          <Select
            getPopupContainer={triggerNode => triggerNode.parentNode}
            placeholder={t('define.form.select.placeholder')}
            onChange={onChangeVcsType}
            disabled={opt === 'edit'}
          >
            <Option value='gitlab'>gitlab</Option>
            <Option value='github'>github</Option>
            <Option value='gitea'>gitea</Option>
            <Option value='gitee'>gitee</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={t('define.address')}
          name='address'
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
          label='Token'
          name='vcsToken'
          rules={[
            {
              required: opt === 'add',
              message: t('define.form.input.placeholder'),
            },
          ]}
        >
          <Input
            placeholder={
              opt === 'add'
                ? t('define.form.input.placeholder')
                : t('define.emptyValueSave.placeholder')
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VcsModal;
