import React, { useState } from 'react';
import { Form, TreeSelect, Modal, Select, Radio } from 'antd';
import { ORG_USER } from 'constants/types';
import { t } from 'utils/i18n';

const { Option } = Select;
const FL = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
};

export default ({ visible, toggleVisible, operation, opt, curRecord, ORG_SET }) => {

  const [ submitLoading, setSubmitLoading ] = useState(false);
  
  const [form] = Form.useForm();
  
  const onOk = async () => {
    const formValues = await form.validateFields();
    setSubmitLoading(true);
    operation({
      doWhat: opt,
      payload: {
        ...formValues,
        id: curRecord && curRecord.id
      }
    }, (hasError) => {
      setSubmitLoading(false);
      !hasError && toggleVisible();
    });
  };

  const treeData = [
    {
      title: 'Node1',
      value: '0-0',
      children: [
        {
          title: 'Child Node1',
          value: '0-0-1'
        },
        {
          title: 'Child Node2',
          value: '0-0-2'
        }
      ]
    },
    {
      title: 'Node2',
      value: '0-1'
    }
  ];
  
  return (
    <Modal
      width={560}
      title={t('define.org.user.action.ldapAdd')}
      visible={visible}
      onCancel={toggleVisible}
      className='antd-modal-type-form'
      okButtonProps={{
        loading: submitLoading
      }}
      cancelButtonProps={{ 
        className: 'ant-btn-tertiary' 
      }}
      onOk={onOk}
    >
      <Form
        {...FL}
        form={form}
      >
        <Form.Item
          label={t('define.page.userSet.basic.field.type')}
          name='type'
          required={true}
          initialValue='LDAP/OU'
        >
          <Radio.Group>
            <Radio value='LDAP/OU'>LDAP/OU</Radio>
            <Radio value='LDAP/User'>LDAP/User</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item noStyle={true} shouldUpdate={true}>
          {(form) => {
            const { type } = form.getFieldsValue();
            return type === 'LDAP/OU' ? (
              <Form.Item
                label='OU'
                name='ou'
                required={true}
              >
                <TreeSelect 
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placeholder={t('define.form.select.placeholder')}
                  treeData={treeData}
                  treeDefaultExpandAll={true}
                />
              </Form.Item>
            ) : (
              <Form.Item
                label='User'
                name='user'
                required={true}
              >
                <Select 
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placeholder={t('define.form.select.placeholder')}
                  options={[{ label: '1', value: '1' }]}
                />
              </Form.Item>
            );
          }}
        </Form.Item>
        <Form.Item
          label={t('define.org.user.role')}
          name='role'
          rules={[
            {
              required: true,
              message: t('define.form.select.placeholder')
            }
          ]}
        >
          <Select 
            getPopupContainer={triggerNode => triggerNode.parentNode}
            placeholder={t('define.form.select.placeholder')}
          >
            {ORG_SET ? (
              Object.keys(ORG_USER.role).map(it => <Option value={it}>{ORG_USER.role[it]}</Option>)
            ) : (
              <Option value='member'>{t('org.role.member')}</Option>
            )}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
