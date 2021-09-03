import React, { useState, useEffect } from 'react';
import { Form, Col, Modal, notification, Row, Select, Table, Input } from "antd";

import projectAPI from 'services/project';
import TableTransfer from 'components/table-transfer';
import { PROJECT_ROLE } from 'constants/types';

const { Option } = Select;
const FL = {
  wrapperCol: { span: 24 }
};

export default ({ orgId, projectId, visible, toggleVisible, operation }) => {

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
  const [ userOptions, setUserOptions ] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserOptions();
  }, []);

  const fetchUserOptions = async () => {
    try {
      const res = await projectAPI.getUserOptions({
        orgId, projectId
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setUserOptions(res.result || []);
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
    operation({
      doWhat: 'add',
      payload: {
        orgId,
        type: 'api',
        ...values
      }
    }, (hasError) => {
      setSubmitLoading(false);
      !hasError && toggleVisible();
    });
  };
  const propsModal = {
    leftTableColumns,
    rightTableColumns
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
          name='name'
          rules={[
            {
              required: true,
              message: '请选择绑定策略组'
            }
          ]}
        >
          <TableTransfer 
            locale={{ itemUnit: '已选', itemsUnit: '未选', searchPlaceholder: '请输入策略名称搜索' }}
            {...propsModal}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
