import React, { useState } from 'react';
import { Form, TreeSelect, Modal, Select, Radio } from 'antd';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { ORG_USER } from 'constants/types';
import { t } from 'utils/i18n';
import ldapAPI from 'services/ldap';

const { Option } = Select;
const FL = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
};

export default ({ visible, toggleVisible, operation, opt, curRecord, ORG_SET, orgId }) => {

  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [form] = Form.useForm();
  
  const {
    data: ous = []
  } = useRequest(
    () => requestWrapper(
      ldapAPI.ous.bind(null, { orgId })
    ), {
      formatResult: res => loopTree(res ? [res] : [])
    }
  );

  const loopTree = (data) => {
    if (!data) {
      return [];
    }
    return data.map((it) => {
      return {
        label: it.ou,
        value: it.dn,
        children: loopTree(it.children)
      };
    });
  };

  const {
    data: users = []
  } = useRequest(
    () => requestWrapper(
      ldapAPI.users.bind(null, { orgId, count: 0 })
    ), {
      formatResult: res => (res && res.ldapUsers) || []
    }
  );
  
  const onOk = async () => {
    const values = await form.validateFields();
    const { type, ...formValues } = values || {};
    setSubmitLoading(true);
    operation({
      doWhat: type === 'LDAP/OU' ? 'addLdapOU' : 'addLdapUser',
      payload: {
        ...formValues
      }
    }, (hasError) => {
      setSubmitLoading(false);
      !hasError && toggleVisible();
    });
  };

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
                name='dn'
                required={true}
              >
                <TreeSelect 
                  showArrow={true}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placeholder={t('define.form.select.placeholder')}
                  treeData={ous}
                  multiple={true}
                  treeDefaultExpandAll={true}
                />
              </Form.Item>
            ) : (
              <Form.Item
                label='User'
                name='email'
                required={true}
              >
                <Select 
                  showArrow={true}
                  mode='multiple'
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  placeholder={t('define.form.select.placeholder')}
                  options={users.map((it) => ({ label: it.uid, value: it.email }))}
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
