
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, notification } from "antd";
import { connect } from "react-redux";

import projectAPI from 'services/project';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import history from 'utils/history';

const FL = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
};

const CreateProjectPage = (props) => {

  const { match, dispatch } = props;
  const { orgId } = match.params;

  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setSubmitLoading(true);
      const res = await projectAPI.createProject({
        ...values,
        orgId
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setSubmitLoading(false);
      reloadGlobalProjects();
      notification.success({
        message: '创建成功'
      });
      const projectId = res.result.id;
      history.push(`/org/${orgId}/project/${projectId}/m-project-env`);
    } catch (e) {
      setSubmitLoading(false);
      notification.error({
        message: '操作失败',
        description: e.message
      });
    }
  };

  // 重新刷新全局的projects
  const reloadGlobalProjects = () => {
    dispatch({
      type: 'global/getProjects',
      payload: {
        orgId
      }
    });
  };

  return <Layout
    extraHeader={<PageHeader
      title='创建项目'
      breadcrumb={true}
    />}
  >
    <div className='idcos-card'>
      <Form
        {...FL}
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
          label='项目名称'
          name='name'
          rules={[
            {
              required: true,
              message: '请输入项目名称'
            }
          ]}
        >
          <Input style={{ width: 254 }} placeholder='请输入项目名称'/>
        </Form.Item>
        <Form.Item
          label='项目描述'
          name='description'
          rules={[
            {
              message: '请输入'
            }
          ]}
        >
          <Input.TextArea style={{ width: 400 }} placeholder='请输入项目描述'/>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type='primary' loading={submitLoading} htmlType={'submit'} >提交</Button>
        </Form.Item>
      </Form>
    </div>
  </Layout>;
};


export default connect()(CreateProjectPage);