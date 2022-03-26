import React from 'react';
import { Form, Button, Input } from 'antd';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import sysAPI from 'services/sys';

const layout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  }
};

export default () => {

  const [form] = Form.useForm();

  // 查询配置
  const {
    run: fetchCfg
  } = useRequest(
    () => requestWrapper(
      sysAPI.getRegistryAddr.bind(null)
    ), {
      onSuccess: (data) => {
        const { registryAddrDB } = data || {};
        form.setFieldsValue({
          registryAddr: registryAddrDB 
        });
      }
    }
  );

  // 更新配置
  const {
    run: updateCfg
  } = useRequest(
    (params) => requestWrapper(
      sysAPI.updateRegistryAddr.bind(null, params), {
        autoSuccess: true
      }
    ), {
      manual: true,
      onSuccess: () => {
        fetchCfg();
      }
    }
  );
  const submitLoading = false;

  const onFinish = (values) => {
    updateCfg(values);
  };

  return (
    <Form
      {...layout}
      style={{ width: 600, margin: '40px auto' }}
      onFinish={onFinish}
      form={form}
    >
      <Form.Item
        label='Registry地址'
        name='registryAddr'
        getValueFromEvent={(e) => e.target.value.trim()}
      >
        <Input placeholder='未设置时默认使用SaaS版Registry' />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 16 }} style={{ paddingTop: 24 }}>
        <Button type='primary' htmlType='submit' loading={submitLoading}>
          保存
        </Button>
      </Form.Item>
    </Form>
  );
};