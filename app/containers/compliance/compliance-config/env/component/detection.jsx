import React, { useState, useEffect, useCallback } from 'react';
import { Form, Tabs, Drawer, notification, Row, Select, Card, Input } from "antd";
import userAPI from 'services/user';

import { ORG_USER } from 'constants/types';
import ComplianceCollapse from 'components/compliance-collapse';

const { Option } = Select;

const FL = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 }
};

const PL = {
  wrapperCol: { span: 24 }
};

export default ({ orgId, operation, visible, toggleVisible }) => {

  const leftTableColumns = [
    {
      dataIndex: 'name',
      title: '姓名'
    },
    {
      dataIndex: 'email',
      title: '邮箱'
    }
  ];

  const rightTableColumns = [
    {
      dataIndex: 'name',
      title: '姓名'
    },
    {
      dataIndex: 'email',
      title: '邮箱'
    }
  ];

  const propsModal = {
    leftTableColumns,
    rightTableColumns
  };

  const [ selectedRowKeys, setSelectedRowKeys ] = useState([]),
    [ panel, setPanel ] = useState('report'),
    [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [{}],
      total: 0
    }),
    [ query, setQuery ] = useState({
      pageNo: 1,
      pageSize: 10
    });

  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserList();
  }, [query]);

  const fetchUserList = async () => {
    try {
      setLoading(true);
      const res = await userAPI.list({
        q: query.name,
        pageSize: query.pageSize,
        currentPage: query.pageNo,
        orgId
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setResultMap({
        list: res.result.list || [],
        total: res.result.total || 0
      });
      setLoading(false);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const changeQuery = (payload) => {
    setQuery({
      ...query,
      ...payload
    });
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name'
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    },
    {
      title: '手机号',
      dataIndex: 'phone'
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    }
  };

  const onOk = async () => {
    const values = await form.validateFields();
    operation({
      doWhat: 'add',
      payload: {
        userIds: selectedRowKeys,
        ...values
      }
    }, toggleVisible);
  };
  
  return <>
    <Drawer
      title='策略名称'
      visible={visible}
      onCancel={toggleVisible}
      bodyStyle={{ padding: 0 }}
      // okButtonProps={{
      //   disabled: !selectedRowKeys.length
      // }}
      width={1000}
      onOk={onOk}
    >
      <Card title={'合规检测'} headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} >
        <ComplianceCollapse/>
      </Card>
    </Drawer>
  </>;
};
