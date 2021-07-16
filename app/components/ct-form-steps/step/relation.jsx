import React, { useState, useEffect } from 'react';
import { Space, Radio, Select, Form, Input, Button, InputNumber, notification, Row, Col } from "antd";

import { ctAPI, sysAPI } from 'services/base';
import history from 'utils/history';
import TagsSelect from 'components/tags-select';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 }
};
const { Option } = Select;

export default ({ stepHelper, orgId }) => {

  const [form] = Form.useForm();

  const [ submitLoading, setSubmitLoading ] = useState(false);

  const onFinish = (values) => {
    // 
  };

  const onChangeSave = (v) => {
    form.setFieldsValue({ projectIds: v });
  };

  return <div className='form-wrapper'>
    <Form
      form={form}
      {...FL}
      onFinish={onFinish}
    >
      <Form.Item
        label='关联项目'
        name='projectIds'
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
      >
        <TagsSelect orgId={orgId} onChangeSave={onChangeSave}/>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 5, span: 14 }}>
        <Button onClick={() => stepHelper.prev()} disabled={submitLoading} style={{ marginRight: 24 }}>上一步</Button>
        <Button type='primary' htmlType={'submit'} loading={submitLoading}>完成创建</Button>
      </Form.Item>
    </Form>
  </div>;
};
