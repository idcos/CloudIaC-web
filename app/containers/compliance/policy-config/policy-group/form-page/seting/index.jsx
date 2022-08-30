import React, { useContext, useEffect, useState, useImperativeHandle } from 'react';
import { Form, Select, Input, Button, Space } from 'antd';
import { t } from 'utils/i18n';
import FormPageContext from '../form-page-context';
import styles from './styles.less';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
};

export default () => {

  const { 
    isCreate, 
    type, 
    formData, 
    setFormData, 
    setCurrent, 
    stepRef, 
    formDataToParams, 
    linkToPolicyGroupList, 
    create,
    createLoading,
    update,
    updateLoading,
    ready
  } = useContext(FormPageContext);
  const [form] = Form.useForm();
  const [ tagSearchValue, setTagSearchValue ] = useState();

  useEffect(() => {
    const formValues = formData[type] || {};
    form.setFieldsValue(formValues);
  }, []);

  const changeTagSearchValue = (value) => {
    if (value && value.length > 16) {
      return;
    }
    setTagSearchValue(value);
  };

  const changeTagsValue = () => {
    setTagSearchValue();
  };

  const prev = () => {
    setCurrent(preValue => preValue - 1);
  };

  const onCreate = async () => {
    const formValues = await form.validateFields();
    const params = formDataToParams({ ...formData, [type]: formValues });
    create(params);
  };

  const onUpdate = async () => {
    const formValues = await form.validateFields();
    const params = formDataToParams({ ...formData, [type]: formValues });
    update(params);
  };

  useImperativeHandle(stepRef, () => ({
    onFinish: async (index) => {
      const formValues = await form.validateFields();
      setFormData(preValue => ({ ...preValue, [type]: formValues }));
      setCurrent(index);
    }
  }));

  return (
    <div className={styles.setingForm}>
      <Form form={form} {...FL}>
        <Form.Item 
          name='name' 
          label={t('define.name')}
          rules={[{ required: true, message: t('define.form.input.placeholder') }]}
        >
          <Input style={{ width: 254 }} placeholder={t('define.form.input.placeholder')} />
        </Form.Item>
        <Form.Item 
          name='description' 
          label={t('define.des')}
        >
          <Input.TextArea placeholder={t('define.form.input.placeholder')} rows={7} />
        </Form.Item>
        <Form.Item 
          name='labels' 
          label={t('define.tag')}
        >
          <Select 
            mode='tags' 
            placeholder={t('define.form.input.placeholder')}
            allowClear={true}
            notFoundContent={t('define.form.input.placeholder')}
            searchValue={tagSearchValue}
            open={false}
            onSearch={changeTagSearchValue}
            onChange={changeTagsValue}
          />
        </Form.Item>
        <Form.Item 
          wrapperCol={{ span: 19, offset: 5 }}
          style={{ paddingTop: 24 }}
        >
          {isCreate ? (
            <Space>
              <Button className='ant-btn-tertiary' onClick={prev}>{t('define.action.prev')}</Button>
              <Button type='primary' onClick={onCreate} loading={createLoading}>{t('define.action.submit')}</Button>
            </Space>
          ) : (
            <Space>
              <Button className='ant-btn-tertiary' onClick={linkToPolicyGroupList}>{t('define.action.cancel')}</Button>     
              <Button type='primary' onClick={onUpdate} loading={updateLoading}>{t('define.action.submit')}</Button>     
            </Space>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};