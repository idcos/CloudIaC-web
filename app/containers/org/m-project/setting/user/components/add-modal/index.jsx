import React, { useState, useEffect } from 'react';
import { Form, Col, Modal, notification, Row, Select, Table, Input } from "antd";
import { t } from 'utils/i18n';
import projectAPI from 'services/project';
import { PROJECT_ROLE } from 'constants/types';

const { Option } = Select;
const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 }
};

export default ({ orgId, projectId, visible, toggleVisible, operation }) => {

  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [ userOptions, setUserOptions ] = useState([]);
  const [form] = Form.useForm();

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
    setSubmitLoading(true);
    operation({
      doWhat: 'add',
      payload: {
        orgId,
        type: 'api',
        ...values
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
