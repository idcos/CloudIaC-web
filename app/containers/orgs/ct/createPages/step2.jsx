import React, { useState, useEffect } from 'react';
import { Space, Radio, Menu, Form, Input, Button, InputNumber } from "antd";

const FL = {
  labelCol: { span: 8 },
  wrapperCol: { span: 24 }
};

export default ({ stepHelper, selection }) => {
  const onFinish = (values) => {
    console.log('Success:', values);
  };

  return <div className='step2'>
    <Form
      {...FL}
      layout='vertical'
      onFinish={onFinish}
    >
      <Form.Item
        label='云模板名称'
        name='name'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input placeholder='请输入云模板名称' />
      </Form.Item>
      <Form.Item
        label='描述'
        name='des'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input.TextArea placeholder='请输入描述' />
      </Form.Item>
      <Form.Item
        label='选择分支'
        name='branch'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input placeholder='请输入描述' />
      </Form.Item>
      <Form.Item
        label='保存状态'
        name='save'
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
      >
        <Radio.Group>
          <Radio value='save'>不保存</Radio>
          <Radio value='notSave'>保存</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label='运行超时' required={true}>
        <Space>
          <Form.Item
            name='timeout'
            rules={[
              {
                required: true,
                message: '请输入'
              }
            ]}
            style={{ display: 'inline-block' }}
          >
            <InputNumber min={0}/>
          </Form.Item>
          <Form.Item
            style={{ display: 'inline-block' }}
          >
            秒
          </Form.Item>
        </Space>
      </Form.Item>
      <Space>
        <Button onClick={() => stepHelper.prev()}>上一步</Button>
        <Button type='primary' htmlType={'submit'}>完成</Button>
      </Space>
    </Form>
  </div>;
};
