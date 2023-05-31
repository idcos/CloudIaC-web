import React, { useState } from 'react';
import {
  Card,
  notification,
  Button,
  Space,
  Table,
  Input,
  Alert,
  Drawer,
  Form,
} from 'antd';
import isEmpty from 'lodash/isEmpty';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import policiesAPI from 'services/policies';
import { TARGET_TYPE_ENUM } from 'constants/types';
import { t } from 'utils/i18n';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 10 },
};

const SuppressFormDrawer = ({ policyId, visible, onClose, reload }) => {
  const [form] = Form.useForm();
  const [addTargetIds, setAddTargetIds] = useState([]);

  // 屏蔽列表查询
  const { loading: tableLoading, data: tableData = {} } = useRequest(
    () =>
      requestWrapper(
        policiesAPI.listSuppressSources.bind(null, { policyId, pageSize: 0 }),
      ),
    {
      ready: !!policyId,
    },
  );

  // 更新策略屏蔽列表
  const { loading: saveLoading, run: updateSuppress } = useRequest(
    params =>
      requestWrapper(policiesAPI.updateSuppress.bind(null, params), {
        autoSuccess: true,
      }),
    {
      manual: true,
      onSuccess: () => {
        onClose();
        reload();
      },
    },
  );

  const columns = [
    {
      dataIndex: 'targetName',
      title: t('define.name'),
      width: 200,
      ellipsis: true,
    },
    {
      dataIndex: 'targetType',
      title: t('define.type'),
      width: 200,
      ellipsis: true,
      render: text => TARGET_TYPE_ENUM[text],
    },
  ];

  const save = async () => {
    const { reason } = await form.validateFields();
    if (isEmpty(addTargetIds)) {
      return notification.error({
        message: t('define.suppress.error.emptyTargetId'),
      });
    }
    updateSuppress({ policyId, addTargetIds, reason });
  };

  return (
    <Drawer
      title={t('define.scan.status.suppressed')}
      visible={visible}
      onClose={onClose}
      width={700}
      bodyStyle={{ padding: 16 }}
      footerStyle={{ textAlign: 'right' }}
      footer={
        <Space>
          <Button onClick={onClose}>{t('define.action.cancel')}</Button>
          <Button type='primary' onClick={save} loading={saveLoading}>
            {t('define.action.save')}
          </Button>
        </Space>
      }
    >
      <Alert
        message={t('define.suppress.alert.message')}
        type='error'
        showIcon={true}
        closable={true}
      />
      <Form form={form} {...FL} style={{ margin: '28px 0' }}>
        <Form.Item
          label={t('define.suppress.field.reason')}
          name='reason'
          rules={[
            {
              required: true,
              message: t('define.form.input.placeholder'),
            },
          ]}
        >
          <Input placeholder={t('define.form.input.placeholder')} />
        </Form.Item>
      </Form>
      <Card title={t('define.suppress.source')} type='inner'>
        <Table
          rowKey='targetId'
          loading={tableLoading}
          columns={columns}
          dataSource={tableData.list || []}
          pagination={{
            showTotal: total =>
              t('define.pagination.showTotal', { values: { total } }),
          }}
          scroll={{ x: 'min-content' }}
          rowSelection={{
            columnWidth: 26,
            onChange: setAddTargetIds,
            selections: [
              Table.SELECTION_ALL,
              Table.SELECTION_INVERT,
              Table.SELECTION_NONE,
            ],
          }}
        />
      </Card>
    </Drawer>
  );
};

export default SuppressFormDrawer;
