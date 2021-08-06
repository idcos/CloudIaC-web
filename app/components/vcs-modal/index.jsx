import React, { useState } from 'react';
import { Form, Input, Modal, Select } from "antd";

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
};
const { Option } = Select;

export default ({ visible, opt, toggleVisible, curRecord = {}, operation }) => {
  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [form] = Form.useForm();

  const onOk = async () => {
    const values = await form.validateFields();
    operation({
      doWhat: opt,
      payload: {
        ...values
      }
    }, (hasError) => {
      setSubmitLoading(false);
      !hasError && toggleVisible();
    });
  };

  const onChangeVcsType = (value) => {
    switch (value) {
      case 'github':
        form.setFieldsValue({ address: 'https://api.github.com/' });
        break;
      case 'gitee':
        form.setFieldsValue({ address: 'https://gitee.com/' });
        break;
      default:
        form.setFieldsValue({ address: '' });
        break;
    }
  };

  return <Modal
    title='添加VCS'
    visible={visible}
    onCancel={toggleVisible}
    okButtonProps={{
      loading: submitLoading
    }}
    onOk={onOk}
    width={408}
    zIndex={1111111}
  >
    <Form
      {...FL}
      form={form}
      initialValues={curRecord}
    >
      <Form.Item
        label='名称'
        name='name'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input placeholder='请输入资源名称'/>
      </Form.Item>
      <Form.Item
        label='类型'
        name='vcsType'
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
      >
        <Select 
          getPopupContainer={triggerNode => triggerNode.parentNode}
          placeholder='请选择VCS类型'
          onChange={onChangeVcsType}
        >
          <Option value='gitlab'>gitlab</Option>
          <Option value='github'>github</Option>
          <Option value='gitea'>gitea</Option>
          <Option value='gitee'>gitee</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label='地址'
        name='address'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input placeholder='请输入地址'/>
      </Form.Item>
      <Form.Item
        label='Token'
        name='vcsToken'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input placeholder='请输入Token密码'/>
      </Form.Item>
    </Form>
  </Modal>;
};
