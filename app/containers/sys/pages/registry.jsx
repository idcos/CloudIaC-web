import React from 'react';
import { Form, Button, Input } from 'antd';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { t } from 'utils/i18n';
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
        label={t('define.page.sysSet.registry.field.registryAddr')}
        name='registryAddr'
      >
        <Input placeholder={t('define.page.sysSet.registry.field.registryAddr.placeholder')} onBlur={(e) => form.setFieldsValue({ name: e.target.value.trim() })}/>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 16 }} style={{ paddingTop: 24 }}>
        <Button type='primary' htmlType='submit' loading={submitLoading}>
          {t('define.action.save')}
        </Button>
      </Form.Item>
    </Form>
  );
};