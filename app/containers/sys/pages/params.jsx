import React, { useState, useEffect } from 'react';

import { Form, Button, InputNumber, Select, Space, notification } from 'antd';

import sysAPI from 'services/sys';

const layout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  }
};
const { Option } = Select;

const Params = () => {
  const [ submitLoading, setSubmitLoading ] = useState(false);

  useEffect(() => {
    fetchInfo();
  }, []);

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setSubmitLoading(true);
      const res = await sysAPI.paramsUpdate({
        value: values.num + ''
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setSubmitLoading(false);
      notification.success({
        message: '操作成功'
      });
    } catch (e) {
      setSubmitLoading(false);
      notification.error({
        message: e.message
      });
    }
  };

  const fetchInfo = async () => {
    try {
      const res = await sysAPI.paramsSearch();
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      form.setFieldsValue({
        num: res.result.value
      });
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };
  return <div style={{ width: 600, margin: '40px auto' }}>
    <Form
      {...layout}
      onFinish={onFinish}
      form={form}
    >
      <Form.Item label='并发作业数' required={true}>
        <Space>
          <Form.Item
            name='num'
            rules={[
              {
                required: true,
                message: '请输入'
              }
            ]}
            style={{ display: 'inline-block' }}
            noStyle={true}
          >
            <InputNumber min={0} precision={0}/>
          </Form.Item>
          <Form.Item
            style={{ display: 'inline-block' }}
            noStyle={true}
          >
            个
          </Form.Item>
        </Space>
      </Form.Item>
      <Form.Item
        label='日志保存周期'
        name='duration'
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
        initialValue='1'
      >
        <Select 
          getPopupContainer={triggerNode => triggerNode.parentNode}
          style={{ width: 240 }}
          disabled={true}
        >
          <Option value='1'>永久保存</Option>
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type='primary' htmlType='submit' loading={submitLoading}>
          更改信息
        </Button>
      </Form.Item>
    </Form>
  </div>;
};

export default Params;
