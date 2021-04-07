import React, { useState } from 'react';
import { Form, Card, Input, notification, Button } from 'antd';
import { orgsAPI } from 'services/base';

const FL = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

export default ({ title, curOrg, dispatch }) => {
  const [ submitLoading, setSubmitLoading ] = useState(false);

  const onFinish = async (values) => {
    try {
      setSubmitLoading(true);
      const res = await orgsAPI.edit({
        ...values,
        id: curOrg.id
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      dispatch({
        type: 'global/getOrgs'
      });
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

  return <div>
    <Card
      title={title}
    >
      <Form
        {...FL}
        layout='vertical'
        onFinish={onFinish}
        initialValues={{
          guid: curOrg.guid,
          name: curOrg.name,
          description: curOrg.description
        }}
      >
        <Form.Item
          label='组织ID'
          name='guid'
          rules={[
            {
              required: true,
              message: '请输入'
            }
          ]}
        >
          <Input placeholder='请输入云模板名称' disabled={true}/>
        </Form.Item>
        <Form.Item
          label='组织名称'
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
          name='description'
          rules={[
            {
              message: '请输入'
            }
          ]}
        >
          <Input.TextArea placeholder='请输入云模板名称' />
        </Form.Item>
        <Button type='primary' htmlType={'submit'} loading={submitLoading}>更改信息</Button>
      </Form>
    </Card>
  </div>;
};
