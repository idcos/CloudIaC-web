import React, { useState, useEffect } from 'react';
import { Form, Col, Modal, notification, Row, Select, Table, Input } from "antd";

import projectAPI from 'services/project';
import { PROJECT_ROLE } from 'constants/types';

const { Option } = Select;
const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
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
      title='新建策略组'
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
          label='策略组名称'
          name='name'
          rules={[
            {
              required: true,
              message: '请输入策略组名称'
            }
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
      <Form
        {...FL}
        form={form}
      >
        <Form.Item
          label='策略组描述'
          name='name'
          rules={[
            {
              required: true,
              message: '请输入策略组描述'
            }
          ]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};
