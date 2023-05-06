import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { connect } from 'react-redux';
import { t } from 'utils/i18n';
import projectAPI from 'services/project';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import history from 'utils/history';

const FL = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const CreateProjectPage = props => {
  const { match, dispatch } = props;
  const { orgId } = match.params;

  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async values => {
    try {
      setSubmitLoading(true);
      const res = await projectAPI.createProject({
        ...values,
        orgId,
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setSubmitLoading(false);
      reloadGlobalProjects();
      notification.success({
        message: t('define.message.opSuccess'),
      });
      const projectId = res.result.id;
      history.push(`/org/${orgId}/project/${projectId}/m-project-overview`);
    } catch (e) {
      setSubmitLoading(false);
      notification.error({
        message: t('define.message.getFail'),
        description: e.message,
      });
    }
  };

  // 重新刷新全局的projects
  const reloadGlobalProjects = () => {
    dispatch({
      type: 'global/getProjects',
      payload: {
        orgId,
      },
    });
  };

  return (
    <Layout
      extraHeader={
        <PageHeader title={t('define.project.create')} breadcrumb={true} />
      }
    >
      <div className='idcos-card'>
        <Form {...FL} form={form} onFinish={onFinish}>
          <Form.Item
            label={t('define.projectName')}
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
            />
          </Form.Item>
          <Form.Item
            label={t('define.projectDes')}
            name='description'
            rules={[
              {
                message: t('define.form.input.placeholder'),
              },
            ]}
          >
            <Input.TextArea
              style={{ width: 400 }}
              placeholder={t('define.form.input.placeholder')}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type='primary' loading={submitLoading} htmlType={'submit'}>
              {t('define.action.submit')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
};

export default connect()(CreateProjectPage);
