import React, { useState, useEffect } from 'react';

import { Card, Form, Button, InputNumber, Select, Space, notification } from 'antd';

import { sysAPI } from 'services/base';

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 20
  }
};
const { Option } = Select;

const Params = ({ title }) => {
  const [ submitLoading, setSubmitLoading ] = useState(false),
    [ info, setInfo ] = useState({});

  useEffect(() => {
    fetchInfo();
  }, []);

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setSubmitLoading(true);
      const res = await sysAPI.edit({
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
      const res = await sysAPI.getParams();
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setInfo(res.result || {});
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
  return <>
    <Card
      title={title}
    >
      <Form
        {...layout}
        layout='vertical'
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
        <Form.Item>
          <Button type='primary' htmlType='submit' loading={submitLoading}>
            更改信息
          </Button>
        </Form.Item>
      </Form>
    </Card>
  </>;
};

export default Params;
