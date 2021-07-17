import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, notification } from "antd";
import { pjtAPI } from 'services/base';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
};

export default ({ visible, opt, toggleVisible, curRecord, orgId, reload, operation }) => {
  const [ submitLoading, setSubmitLoading ] = useState(false),
    [ userList, setUserList ] = useState([]);
  const [form] = Form.useForm();

  const onOk = async () => {
    const { params, ...restValues } = await form.validateFields();
    setSubmitLoading(true);
    operation({
      action: opt,
      payload: {
        orgId,
        projectId: curRecord.id,
        ...restValues, 
        userAuthorization: params 
      }
    }, (hasError) => {
      setSubmitLoading(false);
      !hasError && toggleVisible();
    });
  };

  useEffect(() => {
    if (opt === 'edit') {
      fetchPjtInfo();
    }
    fetchUser();
  }, []);
  const fetchPjtInfo = async() => {
    try {
      const res = await pjtAPI.detailProject({ projectId: curRecord.id, orgId });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };
  const fetchUser = async () => {
    try {
      const res = await pjtAPI.userList({ orgId });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setUserList(res.result.list || []);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  return <Modal
    title={`${opt == 'add' ? '创建' : '编辑'}项目`}
    visible={visible}
    onCancel={toggleVisible}
    okButtonProps={{
      loading: submitLoading
    }}
    onOk={onOk}
    width={600}
  >
    <Form
      {...FL}
      form={form}
      initialValues={curRecord}
    >
      <Form.Item
        label='项目名称'
        name='name'
        rules={[
          {
            required: true,
            message: '请输入项目名称'
          }
        ]}
      >
        <Input style={{ width: 254 }} placeholder='请输入项目名称'/>
      </Form.Item>
      <Form.Item
        label='项目描述'
        name='description'
        rules={[
          {
            message: '请输入'
          }
        ]}
      >
        <Input.TextArea style={{ width: 400 }} placeholder='请输入项目描述'/>
      </Form.Item>
    </Form>
  </Modal>;
};
