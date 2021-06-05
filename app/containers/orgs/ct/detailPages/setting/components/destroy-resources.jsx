import React, { useState } from "react";
import { Button, Modal, Form, Input, notification } from "antd";
import { ExclamationCircleFilled } from '@ant-design/icons';

import { ctAPI } from 'services/base';

export default (props) => {

  const { detailInfo, orgId, linkToRunningDetail } = props;
  const disabled = detailInfo.status === 'disable' || !detailInfo.saveState;
  const [form] = Form.useForm();

  const [ confirmLoading, setConfirmLoading ] = useState(false);

  const openConfirmModal = () => {
    const { 
      name,
      defaultRunnerServiceId,
      defaultRunnerAddr,
      defaultRunnerPort,
      id,
      guid,
      vcsId
    } = detailInfo;
    Modal.confirm({
      width: 480,
      title: `你确定要销毁资源“${name}”吗？`,
      icon: <ExclamationCircleFilled />,
      content: (
        <>
          <div style={{ marginBottom: 29 }}>销毁资源将删除模板所有资源</div>
          <Form layout='vertical' requiredMark='optional' form={form}>
            <Form.Item 
              name='name' 
              label='输入云模板名称以确认' 
              rules={[
                { required: true, message: '请输入云模板名称' },
                () => ({
                  validator(_, value) {
                    if (!value || name === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('云模版名称不一致!'));
                  }
                })
              ]}
            >
              <Input placeholder='请输入云模板名称' />
            </Form.Item>
          </Form>
        </>
      ),
      okText: '确认',
    	cancelText: '取消',
      confirmLoading,
      onOk: async () => {
        const values = await form.validateFields();
        const params = {
          taskType: 'destroy',
          orgId,
          vcsId,
          templateId: id,
          templateGuid: guid,
          ctServiceId: defaultRunnerServiceId,
          ctServiceIp: defaultRunnerAddr,
          ctServicePort: defaultRunnerPort
        };
        setConfirmLoading(true);
        const res = await ctAPI.createTask(params);
        if (res.code != 200) {
          notification.error({
            message: '操作失败',
            description: res.message
          });
          return;
        }
        setConfirmLoading(false);
        notification.success({
          message: '操作成功'
        });
        form.resetFields();
        linkToRunningDetail(res.result && res.result.id);
      },
      onCancel: () => form.resetFields()
    });
  };

  return (
    <div style={{ marginTop: 10 }}>
      <Button
        type='primary'
        disabled={disabled}
        danger={true}
        onClick={openConfirmModal}
      >
        销毁资源
      </Button>
      <p className='tipText reset-styles'>
        销毁资源将删除模板所有资源，包含作业、状态、变量、设置等等，请谨慎操作！
      </p>
    </div>
  );
};
