import React, { useState, useEffect } from 'react';
import { Form, Col, Modal, notification, Row, Select, Table, Input } from "antd";

import cgroupsAPI from 'services/cgroups';
import { PROJECT_ROLE } from 'constants/types';

const { Option } = Select;
const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
};

export default ({ reload, visible, toggleVisible, id }) => {

  const [ submitLoading, setSubmitLoading ] = useState(false); 
  const [ info, setInfo ] = useState({}); 

  const [form] = Form.useForm(); 

  useEffect(() => {
    if (id) {
      getDetail();
    }
  }, []);

  const getDetail = async () => {
    try {
      const res = await cgroupsAPI.detail({
        policyGroupId: id
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      form.setFieldsValue(res.result || {});

    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      if (!!id) {
        values.policyGroupId = id;
      }
      setSubmitLoading(true);
      let mode = !!id ? 'update' : 'create';
      const res = await cgroupsAPI[mode]({
        ...values
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setSubmitLoading(false);
      reload();
      toggleVisible();
    } catch (e) {
      setSubmitLoading(false);
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
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
          name='description'
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};
