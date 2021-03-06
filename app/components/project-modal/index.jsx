import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, notification } from "antd";
import { connect } from "react-redux";

import projectAPI from 'services/project';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
};

const ProjectModal = ({ dispatch, visible, opt, toggleVisible, curRecord = {}, orgId, operation }) => {

  const [ submitLoading, setSubmitLoading ] = useState(false);

  const [form] = Form.useForm();

  const onOk = async () => {
    const values = await form.validateFields();
    setSubmitLoading(true);
    operation({
      action: opt,
      payload: {
        orgId,
        projectId: curRecord.id,
        ...values 
      }
    }, (hasError) => {
      setSubmitLoading(false);
      if (!hasError) {
        toggleVisible();
        reloadGlobalProjects();
      }
    });
  };

  // 重新刷新全局的projects
  const reloadGlobalProjects = () => {
    dispatch({
      type: 'global/getProjects',
      payload: {
        orgId
      }
    });
  };

  useEffect(() => {
    if (opt === 'edit') {
      fetchPjtInfo();
    }
  }, []);

  const fetchPjtInfo = async() => {
    try {
      const res = await projectAPI.detailProject({ projectId: curRecord.id, orgId });
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

export default connect()(ProjectModal);
