import React, { useState } from 'react';
import { Form, Input, Modal, Select } from 'antd';

import { ORG_USER } from 'constants/types';

const { Option } = Select;
const FL = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};

export default ({ visible, toggleVisible, operation, opt, curRecord }) => {
  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [form] = Form.useForm();

  const onOk = async () => {
    const values = await form.validateFields();
    setSubmitLoading(true);
    operation({
      doWhat: opt,
      payload: {
        ...values,
        id: curRecord && curRecord.id
      }
    }, (hasError) => {
      setSubmitLoading(false);
      !hasError && toggleVisible();
    });
  };

  return <Modal
    title={`${opt == 'add' ? '邀请' : '编辑'}成员`}
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
      initialValues={curRecord}
    >
      <Form.Item
        label='邮箱'
        name='email'
        rules={[
          {
            required: true,
            message: '请输入'
          },
          { type: 'email' }
        ]}
        extra='邮箱作为登录名，全局唯一'
      >
        <Input placeholder='请输入邮箱' disabled={opt === 'edit'} />
      </Form.Item>
      <Form.Item
        label='姓名'
        name='name'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input placeholder='请输入姓名'/>
      </Form.Item>
      <Form.Item
        label='手机号'
        name='phone'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input placeholder='请输入手机号'/>
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
          {Object.keys(ORG_USER.role).map(it => <Option value={it}>{ORG_USER.role[it]}</Option>)}
        </Select>
      </Form.Item>
    </Form>
  </Modal>;
};
