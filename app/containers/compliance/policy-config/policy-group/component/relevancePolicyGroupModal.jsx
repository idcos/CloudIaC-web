import React, { useState, useEffect } from 'react';
import { Form, Modal, notification } from "antd";

import cgroupsAPI from 'services/cgroups';
import policiesAPI from 'services/policies';
import union from 'lodash/union'; // 并集
import intersection from 'lodash/intersection'; // 合集
import xor from 'lodash/xor'; // 补集

import TableTransfer from 'components/table-transfer';

const FL = {
  wrapperCol: { span: 24 }
};

export default ({ reload, id, visible, toggleVisible }) => {

  const leftTableColumns = [
    {
      dataIndex: 'name',
      title: '策略',
      ellipsis: true
    }
  ];
  const rightTableColumns = [
    {
      dataIndex: 'name',
      title: '策略',
      ellipsis: true
    }
  ];

  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [ list, setList ] = useState([]);
  const [ bindDate, setBindDate ] = useState([]);
  const [ unBindDate, setUnBindDate ] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      const res = await cgroupsAPI.isBind({
        bind: false,
        policyGroupId: id
      });
      const bindres = await cgroupsAPI.isBind({
        bind: true,
        policyGroupId: id
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      let unBindList = res.result.list || [];
      let bindList = bindres.result.list || [];
      const listUnBind = unBindList.map(d => d.id);
      setUnBindDate(listUnBind);
      
      const listBind = bindList.map(d => d.id);
      setBindDate(listBind);
      form.setFieldsValue({ bindList: listBind });

      setList((bindList.concat(unBindList)).map(d => ({ key: d.id, name: d.name, email: d.id })));
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const getParams = (values) => {
    const rmPolicyIds = [];
    const addPolicyIds = [];
    const allLIst = (list || []).map(d => d.key);
    const nowUnBindDate = xor(allLIst, values.bindList); // 未选择的数据

    nowUnBindDate.forEach(k => {
      if (bindDate.includes(k)) {
        rmPolicyIds.push(k);
      }
    });
    values.bindList.forEach(k => {
      if (unBindDate.includes(k)) {
        addPolicyIds.push(k);
      }
    });
    return {
      addPolicyIds,
      rmPolicyIds
    };
  };

  const onOk = async () => {
    const values = await form.validateFields(); // 已选择的数据
    
    try {
      setSubmitLoading(true);
      const res = await cgroupsAPI.addAndDel({
        policyGroupId: id,
        ...getParams(values)
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
      width={614}
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
        >
          <TableTransfer 
            locale={{ searchPlaceholder: '请输入策略名称搜索' }}
            leftTableColumns={leftTableColumns}
            rightTableColumns={rightTableColumns}
            dataScourt={list || []}
            bindDate={bindDate}
            unBindDate={unBindDate}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
