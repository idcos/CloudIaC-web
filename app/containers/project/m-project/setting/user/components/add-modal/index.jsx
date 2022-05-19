import React, { useState, useEffect } from 'react';
import { Form, Col, Modal, notification, Row, Select, Radio } from "antd";
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { t } from 'utils/i18n';
import projectAPI from 'services/project';
import { PROJECT_ROLE } from 'constants/types';
import ldapAPI from 'services/ldap';

const { Option } = Select;
const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 }
};

export default ({ orgId, projectId, visible, toggleVisible, operation }) => {

  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [ userOptions, setUserOptions ] = useState([]);
  const [form] = Form.useForm();

  const {
    data: ous = []
  } = useRequest(
    () => requestWrapper(
      ldapAPI.orgOus.bind(null, { orgId, pageSize: 0 })
    ), {
      formatResult: res => (res && res.list) || []
    }
  );

  useEffect(() => {
    fetchUserOptions();
  }, []);

  const fetchUserOptions = async () => {
    try {
      const res = await projectAPI.getUserOptions({
        orgId, projectId
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setUserOptions(res.result || []);
    } catch (e) {
      notification.error({
        message: t('define.message.getFail'),
        description: e.message
      });
    }
  };

  const onOk = async () => {
    const values = await form.validateFields();
    const { type, ...formValues } = values || {};
    setSubmitLoading(true);
    operation({
      doWhat: type === 'ou' ? 'addOu' : 'add',
      payload: {
        orgId,
        type: 'api',
        ...formValues
      }
    }, (hasError) => {
      setSubmitLoading(false);
      !hasError && toggleVisible();
    });
  };

  return (
    <Modal
      title={t('define.project.user.action.add')}
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
          label={t('define.page.userSet.basic.field.type')}
          name='type'
          required={true}
          initialValue='ou'
        >
          <Radio.Group>
            <Radio value='ou'>LDAP/OU</Radio>
            <Radio value='user'>LDAP/User</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item noStyle={true} shouldUpdate={true}>
          {(form) => {
            const { type } = form.getFieldsValue();
            return type === 'ou' ? (
              <Form.Item
                label='OU'
                name='dn'
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
                  mode={'multiple'}
                  optionFilterProp='children'
                >
                  {ous.map(it => <Option value={it.dn}>{it.ou}</Option>)}
                </Select>
              </Form.Item>  
            ) : (
              <Form.Item
                label={t('define.user')}
                name='userId'
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
                  mode={'multiple'}
                  optionFilterProp='children'
                >
                  {userOptions.map(it => <Option value={it.id}>{it.name}</Option>)}
                </Select>
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
            {Object.keys(PROJECT_ROLE).map(it => <Option value={it}>{PROJECT_ROLE[it]}</Option>)}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
