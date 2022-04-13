import React, { useState, useEffect } from 'react';
import { Form, Button, InputNumber, Select, Space, notification } from 'antd';
import sysAPI from 'services/sys';
import { t } from "utils/i18n";

const layout = {
  labelCol: {
    span: 8
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

  const onFinish = async ({ MAX_JOBS_PER_RUNNER, TASK_STEP_TIMEOUT, ...restFormData }) => {
    const systemCfg = formatToParams({
      MAX_JOBS_PER_RUNNER: MAX_JOBS_PER_RUNNER + '',
      TASK_STEP_TIMEOUT: TASK_STEP_TIMEOUT + '',
      ...restFormData
    });
    try {
      setSubmitLoading(true);
      const res = await sysAPI.paramsUpdate({ systemCfg });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setSubmitLoading(false);
      notification.success({
        message: t('define.message.opSuccess')
      });
      fetchInfo();
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
      let formData = formatToFormData(res.result);
      // if (formData.TASK_STEP_TIMEOUT == 60) {
      //   formData.TASK_STEP_TIMEOUT = undefined;
      // }
      form.setFieldsValue(formData);
    } catch (e) {
      notification.error({
        message: t('define.message.getFail'),
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
      <Form.Item label={t('define.page.sysSet.params.field.MAX_JOBS_PER_RUNNER')} required={true}>
        <Space>
          <Form.Item
            name='MAX_JOBS_PER_RUNNER'
            rules={[
              {
                required: true,
                message: t('define.form.input.placeholder')
              }
            ]}
            style={{ display: 'inline-block' }}
            noStyle={true}
          >
            <InputNumber min={0} precision={0} placeholder={t('define.form.input.placeholder')} />
          </Form.Item>
          <Form.Item
            style={{ display: 'inline-block' }}
            noStyle={true}
          >
            {t('define.unit.piece')}
          </Form.Item>
        </Space>
      </Form.Item>
      <Form.Item label={t('define.page.sysSet.params.field.TASK_STEP_TIMEOUT')} required={true}>
        <Space>
          <Form.Item
            name='TASK_STEP_TIMEOUT'
            rules={[
              {
                required: true,
                message: t('define.form.input.placeholder')
              }
            ]}
            style={{ display: 'inline-block' }}
            noStyle={true}
          >
            <InputNumber min={0} precision={0} placeholder='60' />
          </Form.Item>
          <Form.Item
            style={{ display: 'inline-block' }}
            noStyle={true}
          >
            {t('define.unit.minute')}
          </Form.Item>
        </Space>
      </Form.Item>
      <Form.Item 
        label={t('define.page.sysSet.params.field.PERIOD_OF_LOG_SAVE')}
        name='PERIOD_OF_LOG_SAVE'
        rules={[
          {
            required: true,
            message: t('define.form.select.placeholder')
          }
        ]}
        initialValue='Permanent'
      >
        <Select 
          getPopupContainer={triggerNode => triggerNode.parentNode}
          style={{ width: 240 }}
          disabled={true}
        >
          <Option value='Permanent'>{t('define.page.sysSet.params.field.PERIOD_OF_LOG_SAVE.option.permanent')}</Option>
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type='primary' htmlType='submit' loading={submitLoading}>
          {t('define.page.sysSet.params.action.save')}
        </Button>
      </Form.Item>
    </Form>
  </div>;
};

export const formatToFormData = (list) => {
  let formData = {};
  (list || []).forEach(({ name, value } = {}) => {
    formData[name] = value;
  });
  return formData;
};

export const formatToParams = (formData) => {
  const params = Object.keys(formData).map(name => {
    return {
      name,
      value: formData[name]
    };
  });
  return params;
};

export default Params;
