import React, { useContext, useEffect, useState, useImperativeHandle } from 'react';
import { Form, Select, Input, Button, Space } from 'antd';
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
          label='策略组名称'
          rules={[{ required: true, message: '请输入' }]}
        >
          <Input style={{ width: 254 }} placeholder='请输入策略组名称' />
        </Form.Item>
        <Form.Item 
          name='description' 
          label='策略组描述'
        >
          <Input.TextArea placeholder='请输入策略组描述' rows={7} />
        </Form.Item>
        <Form.Item 
          name='labels' 
          label='标签'
        >
          <Select 
            mode='tags' 
            placeholder='请填写标签'
            allowClear={true}
            notFoundContent='输入标签并回车'
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
              <Button onClick={prev}>上一步</Button>
              <Button type='primary' onClick={onCreate} loading={createLoading}>提交</Button>
            </Space>
          ) : (
            <Space>
              <Button onClick={linkToPolicyGroupList}>取消</Button>     
              <Button type='primary' onClick={onUpdate} loading={updateLoading}>提交</Button>     
            </Space>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};