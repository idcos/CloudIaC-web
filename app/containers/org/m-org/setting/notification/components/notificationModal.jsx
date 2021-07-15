import React, { useState, useEffect } from 'react';
import { Form, Col, Modal, notification, Row, Select, Table, Input } from "antd";
import { orgsAPI } from 'services/base';

import { ORG_USER } from 'constants/types';

const { Option } = Select;

export default ({ orgId, operation, visible, toggleVisible }) => {
  const [ selectedRowKeys, setSelectedRowKeys ] = useState([]),
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
      const res = await orgsAPI.listUser({
        ...query,
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
    <Modal
      title='添加通知人'
      visible={visible}
      onCancel={toggleVisible}
      okButtonProps={{
        disabled: !selectedRowKeys.length
      }}
      onOk={onOk}
    >
      <Form
        form={form}
      >
        <Form.Item
          label='事件类型'
          name='eventType'
          rules={[
            {
              required: true,
              message: '请选择'
            }
          ]}
        >
          <Select 
            getPopupContainer={triggerNode => triggerNode.parentNode}
            placeholder='请选择事件类型'
          >
            {Object.keys(ORG_USER.notificationType).map(it => <Option value={it}>{ORG_USER.notificationType[it]}</Option>)}
          </Select>
        </Form.Item>
      </Form>
      <Row type='flex' justify='space-between' align='middle' style={{ marginBottom: 8 }}>
        <Col>
          已选 {selectedRowKeys.length || '-'} 个
        </Col>
        <Col>
          <Input.Search
            placeholder='请输入姓名/邮箱搜索'
            style={{ width: 200 }}
            onSearch={(v) => {
              changeQuery({
                name: v,
                pageNo: 1
              });
            }}
          />
        </Col>
      </Row>
      <Table
        rowKey='id'
        columns={columns}
        rowSelection={rowSelection}
        dataSource={resultMap.list}
        loading={loading}
        pagination={{
          current: query.pageNo,
          pageSize: query.pageSize,
          total: resultMap.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共${total}条`,
          onChange: (page, pageSize) => {
            changeQuery({
              pageNo: page,
              pageSize
            });
          }
        }}
      />
    </Modal>
  </>;
};
