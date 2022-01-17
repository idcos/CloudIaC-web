import React, { useState, useEffect } from 'react';
import { Form, Modal, notification, Select } from "antd";
import isEmpty from 'lodash/isEmpty';
import ctplAPI from 'services/ctpl';
import cgroupsAPI from 'services/cgroups';

const { Option } = Select;
const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 }
};

export default ({ title, visible, onClose, id, onSuccess, policyGroupIds }) => {

  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [ list, setList ] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchList();
    form.setFieldsValue({ policyGroupIds: policyGroupIds || [] });
  }, []);

  const fetchList = async () => {
    try {
      const res = await cgroupsAPI.list({
        pageSize: 0
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setList(res.result.list || []);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const onOk = async () => {
    const values = await form.validateFields();
    setSubmitLoading(true);
    try {
      const res = await ctplAPI.update({
        ...values,
        tplId: id
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

  return (
    <Modal
      title={title}
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
          label='绑定策略组'
          name='policyGroupIds'
        >
          <Select 
            getPopupContainer={triggerNode => triggerNode.parentNode}
            placeholder='绑定策略组'
            mode={'multiple'}
            allowClear={true}
            showArrow={true}
            optionFilterProp='children'
          >
            {list.map(it => <Option value={it.id}>{it.name}</Option>)}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
