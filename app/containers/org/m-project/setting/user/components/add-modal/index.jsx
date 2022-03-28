import React, { useState, useEffect } from 'react';
import { Form, Col, Modal, notification, Row, Select, Table, Input } from "antd";

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
        message: '获取失败',
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
      title='添加用户'
      visible={visible}
      onCancel={toggleVisible}
      okButtonProps={{
        loading: submitLoading
      }}
      onOk={onOk}
    >
      <Form
        {...FL}
        form={form}
      >
        <Form.Item
          label='用户'
          name='userId'
          rules={[
            {
              required: true,
              message: '请选择'
            }
          ]}
        >
          <Select 
            getPopupContainer={triggerNode => triggerNode.parentNode}
            placeholder='请选择用户'
            mode={'multiple'}
            optionFilterProp='children'
          >
            {userOptions.map(it => <Option value={it.id}>{it.name}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item
          label='角色'
          name='role'
          rules={[
            {
              required: true,
              message: '请选择'
            }
          ]}
        >
          <Select 
            getPopupContainer={triggerNode => triggerNode.parentNode}
            placeholder='请选择角色'
          >
            {Object.keys(PROJECT_ROLE).map(it => <Option value={it}>{PROJECT_ROLE[it]}</Option>)}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
