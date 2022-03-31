import React, { useState } from 'react';
import { Form, Input, Modal, Select, Tooltip, Space, Checkbox } from 'antd';
import { ORG_USER } from 'constants/types';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const FL = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
};
const FLItem = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 }
};

export default ({ visible, toggleVisible, operation, opt, curRecord, isBatch }) => {

  const [ submitLoading, setSubmitLoading ] = useState(false);
  
  const [form] = Form.useForm();
  
  const onOk = async () => {
    const values = await form.validateFields();
    if (isBatch) {
      values.email = values.email.split('\n');
    }
    setSubmitLoading(true);
    operation({
      doWhat: isBatch ? 'batchAdd' : opt,
      payload: {
        ...values,
        id: curRecord && curRecord.id
      }
    }, (hasError) => {
      setSubmitLoading(false);
      !hasError && toggleVisible();
    });
  };

  const rulesConfig = (form) => {
    let ruleList = [
      {
        required: true,
        message: '请输入'
      }
    ];
    if (!isBatch) {
      ruleList.push({ type: 'email', message: '邮箱格式有误' });
    }
    return ruleList;
  };

  return <Modal
    width={560}
    title={isBatch ? '批量邀请' : `${opt == 'add' ? '邀请' : '编辑'}成员`}
    visible={visible}
    onCancel={toggleVisible}
    okButtonProps={{
      loading: submitLoading
    }}
    cancelButtonProps={{ 
      className: 'ant-btn-tertiary' 
    }}
    onOk={onOk}
  >
    <Form
      {...FL}
      form={form}
      initialValues={curRecord}
    >
      {isBatch ? (<Form.Item
        required={true}
      >
        <Space size={0} align={'start'} direction={'vertical'} className={'text-area-dotted'}>
          <div className='itemRequired'>邮箱</div>
          <Form.Item
            name='email'
            rules={rulesConfig()}
            {...FLItem}
          >
            <Input.TextArea rows={8} style={{ width: 472, border: '1px dashed #C9CCD1', borderRadius: 0 }} placeholder='邮箱一行一个' disabled={opt === 'edit'} />
          </Form.Item>
        </Space>
      </Form.Item>) :
        (<Form.Item
          label='邮箱'
          required={true}
        >
          <Space align={'center'}>
          
            <Form.Item
              name='email'
              rules={rulesConfig()}
              noStyle={true}
            >
              <Input style={{ width: 280 }} placeholder='请输入邮箱' disabled={opt === 'edit'} />
            </Form.Item>
            <Tooltip title='邮箱全局唯一，作为登录用户名'><InfoCircleOutlined /></Tooltip>
          </Space>
        </Form.Item>)}
      {!isBatch && <Form.Item
        label='姓名'
        name='name'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input placeholder='请输入姓名' />
      </Form.Item>}
      {!isBatch && <Form.Item
        label='手机号'
        name='phone'
        rules={[{ pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' }]}
      >
        <Input placeholder='请输入手机号' />
      </Form.Item>}
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
          style={{ width: 220 }}
          getPopupContainer={triggerNode => triggerNode.parentNode}
          placeholder='请选择角色'
        >
          {Object.keys(ORG_USER.role).map(it => <Option value={it}>{ORG_USER.role[it]}</Option>)}
        </Select>
      </Form.Item>
    </Form>
  </Modal>;
};
