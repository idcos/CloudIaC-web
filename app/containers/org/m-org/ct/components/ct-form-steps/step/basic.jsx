import React, { useImperativeHandle, useEffect } from 'react';
import {
  Space,
  Form,
  Input,
  Button,
  Switch,
  Alert,
  Select,
  Checkbox,
} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import cgroupsAPI from 'services/cgroups';
import { t } from 'utils/i18n';

const FL = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

const Basic = ({
  onlineCheckForm,
  goCTlist,
  opType,
  childRef,
  stepHelper,
  ctData,
  type,
  saveLoading,
}) => {
  const [form] = Form.useForm();

  useImperativeHandle(childRef, () => ({
    onFinish: async index => {
      const values = await form.validateFields();
      await onlineCheckForm(values);
      stepHelper.updateData({
        type,
        data: values,
      });
      stepHelper.go(index);
    },
  }));

  // 策略组选项列表查询
  const { data: policiesGroupOptions = [] } = useRequest(() =>
    requestWrapper(cgroupsAPI.list.bind(null, { pageSize: 0 }), {
      formatDataFn: res =>
        ((res.result || {}).list || []).map(({ name, id }) => ({
          label: name,
          value: id,
        })),
    }),
  );

  const onFinish = async values => {
    await onlineCheckForm(values);
    stepHelper.updateData({
      type,
      data: values,
      isSubmit: opType === 'edit',
    });
    opType === 'add' && stepHelper.next();
  };

  useEffect(() => {
    if (ctData[type]) {
      form.setFieldsValue(ctData[type]);
    }
  }, [ctData, type]);

  return (
    <div className='form-wrapper' style={{ width: 600 }}>
      <Form form={form} {...FL} onFinish={onFinish}>
        <Form.Item
          label={t('define.name')}
          name='name'
          rules={[
            {
              required: true,
              message: t('define.form.input.placeholder'),
            },
          ]}
        >
          <Input
            style={{ width: 254 }}
            placeholder={t('define.form.input.placeholder')}
            onBlur={e => form.setFieldsValue({ name: e.target.value.trim() })}
          />
        </Form.Item>
        <Form.Item label={t('define.des')} name='description'>
          <Input.TextArea
            placeholder={t('define.form.input.placeholder')}
            rows={7}
          />
        </Form.Item>
        <Form.Item
          label={t('define.ct.field.policyEnable')}
          name='policyEnable'
          valuePropName='checked'
        >
          <Switch />
        </Form.Item>
        <Form.Item noStyle={true} shouldUpdate={true}>
          {({ getFieldValue }) => {
            const policyEnable = getFieldValue('policyEnable');
            return policyEnable ? (
              <>
                <Alert
                  message={t('define.ct.form.policyEnable.alert')}
                  type='info'
                  showIcon={true}
                  icon={<InfoCircleOutlined style={{ color: '#166CC1' }} />}
                  style={{
                    margin: '-16px 0 16px',
                    backgroundColor: '#e9f3fc',
                    borderColor: '#e9f3fc',
                  }}
                />
                <Form.Item
                  label={t('define.ct.field.policyGroup')}
                  name='policyGroup'
                  rules={[
                    {
                      required: true,
                      message: t('define.form.select.placeholder'),
                    },
                  ]}
                >
                  <Select
                    mode='multiple'
                    optionFilterProp='label'
                    showArrow={true}
                    showSearch={true}
                    options={policiesGroupOptions}
                    placeholder={t('define.form.select.placeholder')}
                  />
                </Form.Item>
                <Form.Item
                  name='tplTriggers'
                  wrapperCol={{ offset: 7, span: 15 }}
                  className='ant-form-item-no-min-height'
                >
                  <Checkbox.Group>
                    <Checkbox value='commit'>
                      {t('define.ct.field.tplTriggers.option.commit')}
                    </Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </>
            ) : null;
          }}
        </Form.Item>
        <Form.Item
          wrapperCol={{ offset: 7, span: 15 }}
          style={{ paddingTop: 24, marginBottom: 0 }}
        >
          <Space size={24}>
            {opType === 'add' ? (
              <>
                <Button
                  className='ant-btn-tertiary'
                  onClick={() => stepHelper.prev()}
                >
                  {t('define.action.prev')}
                </Button>
                <Button type='primary' htmlType={'submit'}>
                  {t('define.action.next')}
                </Button>
              </>
            ) : (
              <>
                <Button className='ant-btn-tertiary' onClick={goCTlist}>
                  {t('define.action.cancel')}
                </Button>
                <Button
                  type='primary'
                  htmlType={'submit'}
                  loading={saveLoading}
                >
                  {t('define.action.submit')}
                </Button>
              </>
            )}
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Basic;
