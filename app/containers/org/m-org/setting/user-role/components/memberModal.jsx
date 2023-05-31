import React, { useState } from 'react';
import { Form, Input, Modal, Select, Tooltip, Space } from 'antd';
import { ORG_USER } from 'constants/types';
import { InfoCircleOutlined } from '@ant-design/icons';
import { t } from 'utils/i18n';

const { Option } = Select;
const FL = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};
const FLItem = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

const MemberModal = ({
  visible,
  toggleVisible,
  operation,
  opt,
  curRecord,
  isBatch,
  ORG_SET,
}) => {
  const [submitLoading, setSubmitLoading] = useState(false);

  const [form] = Form.useForm();

  const onOk = async () => {
    const values = await form.validateFields();
    if (isBatch) {
      values.email = values.email.split('\n');
    }
    setSubmitLoading(true);
    operation(
      {
        doWhat: isBatch ? 'batchAdd' : opt,
        payload: {
          ...values,
          id: curRecord && curRecord.id,
        },
      },
      hasError => {
        setSubmitLoading(false);
        !hasError && toggleVisible();
      },
    );
  };

  const rulesConfig = form => {
    let ruleList = [
      {
        required: true,
        message: t('define.form.input.placeholder'),
      },
    ];
    if (!isBatch) {
      ruleList.push({
        type: 'email',
        message: t('define.loginPage.email.formatError'),
      });
    }
    return ruleList;
  };

  if (isBatch) {
    return (
      <Modal
        width={560}
        title={t('define.org.user.action.batchAdd')}
        visible={visible}
        onCancel={toggleVisible}
        okButtonProps={{
          loading: submitLoading,
        }}
        cancelButtonProps={{
          className: 'ant-btn-tertiary',
        }}
        onOk={onOk}
      >
        <Form {...FL} form={form} initialValues={curRecord}>
          <Form.Item required={true} noStyle={true}>
            <Space
              size={0}
              align={'start'}
              direction={'vertical'}
              className={'text-area-dotted'}
            >
              <div className='itemRequired'>
                {t('define.page.userSet.basic.field.email')}
              </div>
              <Form.Item name='email' rules={rulesConfig()} {...FLItem}>
                <Input.TextArea
                  rows={8}
                  style={{ width: 472, borderStyle: 'dashed', borderRadius: 0 }}
                  placeholder={t('define.org.user.batch.email.placeholder')}
                  disabled={opt === 'edit'}
                />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item
            label={t('define.org.user.role')}
            name='role'
            rules={[
              {
                required: true,
                message: t('define.form.select.placeholder'),
              },
            ]}
          >
            <Select
              style={{ width: 220 }}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              placeholder={t('define.form.select.placeholder')}
            >
              {ORG_SET ? (
                Object.keys(ORG_USER.role).map(it => (
                  <Option value={it}>{ORG_USER.role[it]}</Option>
                ))
              ) : (
                <Option value='member'>{t('org.role.member')}</Option>
              )}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  } else {
    return (
      <Modal
        width={560}
        title={
          opt === 'add'
            ? t('define.org.user.action.add')
            : t('define.action.modify')
        }
        visible={visible}
        onCancel={toggleVisible}
        className='antd-modal-type-form'
        okButtonProps={{
          loading: submitLoading,
        }}
        cancelButtonProps={{
          className: 'ant-btn-tertiary',
        }}
        onOk={onOk}
      >
        <Form {...FL} form={form} initialValues={curRecord}>
          <Form.Item
            label={t('define.page.userSet.basic.field.email')}
            required={true}
          >
            <Space align={'center'}>
              <Form.Item name='email' rules={rulesConfig()} noStyle={true}>
                <Input
                  style={{ width: 280 }}
                  placeholder={t('define.form.input.placeholder')}
                  disabled={opt === 'edit'}
                />
              </Form.Item>
              <Tooltip title={t('define.page.userSet.basic.field.email.extra')}>
                <InfoCircleOutlined />
              </Tooltip>
            </Space>
          </Form.Item>
          <Form.Item
            label={t('define.page.userSet.basic.field.name')}
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
            label={t('define.page.userSet.basic.field.phone')}
            name='phone'
            rules={[
              {
                pattern: /^1[3456789]\d{9}$/,
                message: t('define.form.error.format'),
              },
            ]}
          >
            <Input placeholder={t('define.form.input.placeholder')} />
          </Form.Item>
          <Form.Item
            label={t('define.org.user.role')}
            name='role'
            rules={[
              {
                required: true,
                message: t('define.form.select.placeholder'),
              },
            ]}
          >
            <Select
              style={{ width: 220 }}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              placeholder={t('define.form.select.placeholder')}
            >
              {ORG_SET ? (
                Object.keys(ORG_USER.role).map(it => (
                  <Option value={it}>{ORG_USER.role[it]}</Option>
                ))
              ) : (
                <Option value='member'>{t('org.role.member')}</Option>
              )}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
};

export default MemberModal;
