import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, notification, Select, Radio, Space } from 'antd';

import { sysAPI } from 'services/base';

const { Option } = Select;

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
};

export default ({ visible, toggleVisible, operation, opt }) => {
  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [ ctRunnerList, setCtRunnerList ] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCTRunner();
  }, []);

  const onOk = async () => {
    const values = await form.validateFields();
    const { ctServiceId, ...restValues } = values;
    const ctInfo = ctRunnerList.find(it => it.ID == ctServiceId) || {};
    const { Port, Address } = ctInfo;
    setSubmitLoading(true);
    operation({
      doWhat: opt,
      payload: {
        ...restValues,
        defaultRunnerServiceId: ctServiceId,
        defaultRunnerAddr: Address,
        defaultRunnerPort: Port
      }
    }, (hasError) => {
      setSubmitLoading(false);
      !hasError && toggleVisible();
    });
  };

  const fetchCTRunner = async () => {
    try {
      const res = await sysAPI.listCTRunner({});
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setCtRunnerList(res.result || []);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const userinfo = () => {
    return (
      <Form.Item
        label='填写信息'
        name='info'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Space
          style={{ display: "flex" }}
          align='center'
        >
          <Form.Item
            name={'userName'}
            rules={[{ required: true, message: "请输入" }]}
          >
            <Input placeholder={'请填写姓名'}/>
          </Form.Item>
          <Form.Item
            name={'email'}
            rules={[
              { required: true, message: "" } // 编辑状态密文可留空
            ]}
          >
            <Input placeholder={'请填写邮箱'}/>
          </Form.Item>
        </Space>
      </Form.Item>
    );
  };
  return <Modal
    title={`${opt == 'add' ? '创建' : '编辑'}组织`}
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
      initialValues={{
        usermock: 'type1'
      }}
    >
      <Form.Item
        label='组织名称'
        name='name'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input placeholder='请输入组织名称'/>
      </Form.Item>
      {/* <Form.Item
        label='CT Runner'
        name='ctServiceId'
        rules={[
          {
            required: true,
            message: '请选择CT Runner'
          }
        ]}
      >
        <Select 
          getPopupContainer={triggerNode => triggerNode.parentNode}
          placeholder='请选择CT Runner'
        >
          {ctRunnerList.map(it => <Option value={it.ID}>{it.Service}</Option>)}
        </Select>
      </Form.Item> */}
      <Form.Item
        label='组织描述'
        name='description'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input.TextArea placeholder='请输入组织描述'/>
      </Form.Item>
      <Form.Item
        label='添加管理员'
        name='usermock'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Radio.Group>
          <Radio value={'type1'}>平台用户</Radio>
          <Radio value={'type2'}>邀请新用户</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item noStyle={true} shouldUpdate={true}>
        {({ getFieldValue }) => {
          const type = (getFieldValue('usermock') || 'type1');
          if (type === 'type1') {
            return <Form.Item
              label='选择管理员'
              name='ctServiceId'
              rules={[
                {
                  required: true,
                  message: '请选择管理员'
                }
              ]}
            >
              <Select 
                getPopupContainer={triggerNode => triggerNode.parentNode}
                placeholder='请选择管理员'
              >
                {ctRunnerList.map(it => <Option value={it.ID}>{it.Service}</Option>)}
              </Select>
            </Form.Item>;
          } else if (type === 'type2') {
            return userinfo();
          } else {
            return <></>;
          }
        }}
      </Form.Item>
    </Form>
  </Modal>;
};
