import React, { useState } from 'react';
import { Card, notification, Button, Space, Table, Input, Alert, Drawer, Form } from 'antd';
import isEmpty from 'lodash/isEmpty';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import policiesAPI from 'services/policies';
import { TARGET_TYPE_ENUM } from 'constants/types';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 10 }
};

export default ({ policyId, visible, onClose, reload }) => {

  const [form] = Form.useForm();
  const [addTargetIds, setAddTargetIds] = useState([]);

  // 屏蔽列表查询
  const {
    loading: tableLoading,
    data: tableData = {}
  } = useRequest(
    () => requestWrapper(
      policiesAPI.listSuppressSources.bind(null, { policyId, currentPage: 1, pageSize: 100000 })
    ),
    {
      ready: !!policyId
    }
  );

  // 更新策略屏蔽列表
  const {
    loading: saveLoading,
    run: updateSuppress
  } = useRequest(
    (params) => requestWrapper(
      policiesAPI.updateSuppress.bind(null, params),
      {
        autoSuccess: true
      }
    ),
    {
      manual: true,
      onSuccess: () => {
        onClose();
        reload();
      }
    }
  );

  const columns = [
    {
      dataIndex: 'targetName',
      title: '名称'
    },
    {
      dataIndex: 'targetType',
      title: '类型',
      render: (text) => TARGET_TYPE_ENUM[text]
    }
  ];

  const save = async () => {
    const { reason } = await form.validateFields();
    if (isEmpty(addTargetIds)) {
      return notification.error({ message: '请勾选来源' });
    }
    updateSuppress({ policyId, addTargetIds, reason });
  };

  return (
    <Drawer
      title='屏蔽'
      visible={visible}
      onClose={onClose}
      width={700}
      bodyStyle={{ padding: 16 }}
      footerStyle={{ textAlign: 'right' }}
      footer={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button type='primary' onClick={save} loading={saveLoading}>保存</Button>
        </Space>
      }
    >
      <Alert 
        message='提示：策略禁用后所有应用该策略的环境和云模板在执行检测时都将忽略该条策略'
        type='error'
        showIcon={true}
        closable={true}
      />
      <Form 
        form={form} 
        {...FL}
        style={{ margin: '28px 0' }}
      >
        <Form.Item
          label='屏蔽说明'
          name='reason'
          rules={[
            {
              required: true,
              message: '请输入'
            }
          ]}
        >
          <Input placeholder={'请填写屏蔽说明'}/>
        </Form.Item>
      </Form>
      <Card title='来源' type='inner'>
        <Table 
          rowKey='targetId'
          loading={tableLoading}
          columns={columns}
          dataSource={tableData.list || []}
          pagination={{
            showTotal: (total) => `共${total}条`
          }}
          rowSelection={{
            onChange: setAddTargetIds,
            selections: [
              Table.SELECTION_ALL,
              Table.SELECTION_INVERT,
              Table.SELECTION_NONE
            ]
          }}
        />
      </Card>
    </Drawer>
  );
};