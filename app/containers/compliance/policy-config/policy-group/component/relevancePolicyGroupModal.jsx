import React, { useState, useEffect } from 'react';
import { Form, Modal, notification } from "antd";

import cgroupsAPI from 'services/cgroups';
import policiesAPI from 'services/policies';

import TableTransfer from 'components/table-transfer';

const FL = {
  wrapperCol: { span: 24 }
};

export default ({ reload, id, visible, toggleVisible }) => {

  const leftTableColumns = [
    {
      dataIndex: 'name',
      title: '策略'
    }
  ];
  const rightTableColumns = [
    {
      dataIndex: 'name',
      title: '策略'
    }
  ];

  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [ list, setList ] = useState([]);
  const [ bindDate, setBindDate ] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchList();
    fetchBindPolicy();
  }, []);

  const fetchBindPolicy = async () => {
    try {
      const res = await cgroupsAPI.isBind({
        bind: true,
        policyGroupId: id
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      const list = (res.result.list || []).map(d => d.id);
      setBindDate(list);
      form.setFieldsValue({ bindList: list });
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const fetchList = async () => {
    try {
      const res = await policiesAPI.list({
        currentPage: 1, pageSize: 100000
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      let list = (res.result.list || []).map(d => ({ key: d.id, name: d.name, email: d.id }));
      setList(list || []);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const onOk = async () => {
    const values = await form.validateFields();
    try {
      setSubmitLoading(true);
      const res = await cgroupsAPI.addAndDel({
        policyGroupId: id,
        values
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setSubmitLoading(false);
      toggleVisible();
      reload();
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
      title='关联策略'
      visible={visible}
      onCancel={toggleVisible}
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
          name='bindList'
          rules={[
            {
              required: true,
              message: '请选择绑定策略组'
            }
          ]}
        >
          <TableTransfer 
            locale={{ itemUnit: '已选', itemsUnit: '未选', searchPlaceholder: '请输入策略名称搜索' }}
            leftTableColumns={leftTableColumns}
            rightTableColumns={rightTableColumns}
            dataScourt={list || []}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
