import React, { useState, useEffect, useMemo } from 'react';
import { Form, Modal, notification, Select } from "antd";
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import cenvAPI from 'services/cenv';
import ctplAPI from 'services/ctpl';
import cgroupsAPI from 'services/cgroups';
import EllipsisText from 'components/EllipsisText';

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
      ctplAPI.listBindPoliciesGroups.bind(null, { id: tplId, currentPage: 1, pageSize: 100000 }),
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
      cgroupsAPI.list.bind(null, { currentPage: 1, pageSize: 100000 }),
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
        message: '获取失败',
        description: e.message
      });
    }
  };

  // 过滤云模版已经绑定掉策略组
  const filterPoliciesGroupOptions = useMemo(() => {
    return policiesGroupOptions.filter(({ value }) => {
      return !ctPoliciesGroups.find(({ groupId }) => groupId === value);
    });
  }, [ ctPoliciesGroups, policiesGroupOptions ]);

  return (
    <Modal
      title={title}
      width={600}
      visible={visible}
      onCancel={onClose}
      okButtonProps={{
        loading: submitLoading
      }}
      onOk={onOk}
    >
      <Form
        {...FL}
        form={form}
      >
        <Form.Item
          label='云模版绑定策略组'
        >
          <EllipsisText style={{ display: 'block' }}>
            {
              ctPoliciesGroups.length > 0 ? (
                ctPoliciesGroups.map(({ groupName }) => groupName).join('、')
              ) : '-'
            }
          </EllipsisText>
        </Form.Item>
        <Form.Item
          label='环境绑定策略组'
          name='policyGroupIds'
          rules={[
            {
              required: ctPoliciesGroups.length === 0,
              message: '请绑定策略组'
            }
          ]}
        >
          <Select 
            getPopupContainer={triggerNode => triggerNode.parentNode}
            placeholder='绑定策略组'
            showArrow={true}
            optionFilterProp='label'
            mode={'multiple'}
            options={filterPoliciesGroupOptions}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
