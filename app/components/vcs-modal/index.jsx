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
    const payload = opt === 'add' ? values : { ...values, id: curRecord.id };
    operation({
      doWhat: opt,
      payload
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
    title={opt === 'add' ? '添加VCS' : '编辑VCS'}
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
    width={550}
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
          disabled={opt === 'edit'}
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
            required: opt === 'add',
            message: '请输入Token密码'
          }
        ]}
      >
        <Input placeholder={opt === 'add' ? '请输入' : '空值保存时不会修改原有值'}/>
      </Form.Item>
    </Form>
  </Modal>;
};
