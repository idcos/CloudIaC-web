import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, notification } from "antd";
import { connect } from "react-redux";
import { t } from 'utils/i18n';
import projectAPI from 'services/project';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
};

const ProjectModal = ({ dispatch, visible, opt, toggleVisible, curRecord = {}, orgId, operation }) => {

  const [ submitLoading, setSubmitLoading ] = useState(false);

  const [form] = Form.useForm();

  const onOk = async () => {
    const values = await form.validateFields();
    setSubmitLoading(true);
    operation({
      action: opt,
      payload: {
        orgId,
        projectId: curRecord.id,
        ...values 
      }
    }, (hasError) => {
      setSubmitLoading(false);
      if (!hasError) {
        toggleVisible();
        reloadGlobalProjects();
      }
    });
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

  useEffect(() => {
    if (opt === 'edit') {
      fetchPjtInfo();
    }
  }, []);

  const fetchPjtInfo = async() => {
    try {
      const res = await projectAPI.detailProject({ projectId: curRecord.id, orgId });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
    } catch (e) {
      notification.error({
        message: t('define.message.getFail'),
        description: e.message
      });
    }
  };
 
  return <Modal
    title={opt == 'add' ? t('define.createProject') : t('define.modifyProject')}
    visible={visible}
    onCancel={toggleVisible}
    okButtonProps={{
      loading: submitLoading
    }}
    className='antd-modal-type-form'
    cancelButtonProps={{ 
      className: 'ant-btn-tertiary' 
    }}
    onOk={onOk}
    width={600}
  >
    <Form
      {...FL}
      form={form}
      initialValues={curRecord}
    >
      <Form.Item
        label={t('define.projectName')}
        name='name'
        getValueFromEvent={(e) => e.target.value.trim()}
        rules={[
          {
            required: true,
            message: t('define.form.input.placeholder')
          }
        ]}
      >
        <Input style={{ width: 254 }} placeholder={t('define.form.input.placeholder')} />
      </Form.Item>
      <Form.Item
        label={t('define.projectDes')}
        name='description'
        rules={[
          {
            message: t('define.form.input.placeholder')
          }
        ]}
      >
        <Input.TextArea style={{ width: 400 }} placeholder={t('define.form.input.placeholder')}/>
      </Form.Item>
    </Form>
  </Modal>;
};

export default connect()(ProjectModal);
