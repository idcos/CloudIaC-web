import React, { useState, useEffect, useMemo } from 'react';
import { Form, Modal, notification, Select } from "antd";
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import cenvAPI from 'services/cenv';
import ctplAPI from 'services/ctpl';
import cgroupsAPI from 'services/cgroups';
import EllipsisText from 'components/EllipsisText';
import { t } from 'utils/i18n';

const FL = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
};

export default ({ title, visible, onClose, id, tplId, onSuccess, policyGroupIds }) => {

  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ policyGroupIds: policyGroupIds || [] });
  }, []);

  // 云模版绑定策略组查询
  const { data: ctPoliciesGroups = [] } = useRequest(
    () => requestWrapper(
      ctplAPI.listBindPoliciesGroups.bind(null, { id: tplId, pageSize: 0 }),
      {
        formatDataFn: (res) => (res.result || {}).list || []
      }
    ),
    {
      ready: !!tplId
    }
  );

  // 策略组选项列表查询
  const { data: policiesGroupOptions = [] } = useRequest(
    () => requestWrapper(
      cgroupsAPI.list.bind(null, { pageSize: 0 }),
      {
        formatDataFn: (res) => ((res.result || {}).list || []).map(({ name, id }) => ({ label: name, value: id }))
      }
    )
  );

  const onOk = async () => {
    const values = await form.validateFields();
    setSubmitLoading(true);
    try {
      const res = await cenvAPI.update({
        ...values,
        envId: id
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setSubmitLoading(false);
      onClose && onClose();
      onSuccess && onSuccess();
    } catch (e) {
      setSubmitLoading(false);
      notification.error({
        message: t('define.message.getFail'),
        description: e.message
      });
    }
  };

  return (
    <Modal
      title={title}
      width={600}
      visible={visible}
      onCancel={onClose}
      okButtonProps={{
        loading: submitLoading
      }}
      cancelButtonProps={{ 
        className: 'ant-btn-tertiary' 
      }}
      className='antd-modal-type-form'
      onOk={onOk}
    >
      <Form
        {...FL}
        form={form}
      >
        <Form.Item
          label='环境绑定策略组'
          name='policyGroupIds'
          rules={[
            {
              required: true,
              message: '请绑定策略组'
            }
          ]}
        >
          <Select 
            getPopupContainer={triggerNode => triggerNode.parentNode}
            placeholder='绑定策略组'
            showArrow={true}
            optionFilterProp='label'
            allowClear={true}
            mode={'multiple'}
            options={policiesGroupOptions}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
