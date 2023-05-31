import React, { useState, useEffect, useCallback } from 'react';
import { Form, Drawer, notification, Button, Select, Input } from 'antd';
import userAPI from 'services/user';
import notificationsAPI from 'services/notifications';
import { ORG_USER } from 'constants/types';
import { t } from 'utils/i18n';
import TableTransfer from 'components/table-transfer';

const { Option } = Select;

const FL = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};

const NotificationModal = ({
  orgId,
  operation,
  visible,
  toggleVisible,
  notificationId,
}) => {
  const leftTableColumns = [
    {
      dataIndex: 'name',
      title: t('define.page.userSet.basic.field.name'),
      width: 96,
      ellipsis: true,
    },
    {
      dataIndex: 'email',
      title: t('define.page.userSet.basic.field.email'),
      width: 184,
      ellipsis: true,
    },
  ];

  const rightTableColumns = [
    {
      dataIndex: 'name',
      title: t('define.page.userSet.basic.field.name'),
      width: 96,
      ellipsis: true,
    },
    {
      dataIndex: 'email',
      title: t('define.page.userSet.basic.field.email'),
      width: 184,
      ellipsis: true,
    },
  ];

  const [panel, setPanel] = useState('email'),
    [list, setList] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserList();
    if (notificationId) {
      getDetail();
    }
  }, []);

  const getDetail = async () => {
    try {
      const res = await notificationsAPI.detailNotification({
        notificationId,
        orgId,
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      if (res.result.notificationType === 'email') {
        form.setFieldsValue(res.result);
      } else {
        let org = {};
        org[`${res.result.notificationType}-url`] = res.result.url;
        form.setFieldsValue({ ...org, ...res.result });
      }
      setPanel(res.result.notificationType || 'email');
    } catch (e) {
      notification.error({
        message: t('define.message.getFail'),
        description: e.message,
      });
    }
  };

  const fetchUserList = async () => {
    try {
      const res = await userAPI.list({
        pageSize: 0,
        orgId,
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      let lists = (res.result.list || []).map(it => ({
        name: it.name,
        email: it.email,
        key: it.id,
      }));
      setList(lists || []);
    } catch (e) {
      notification.error({
        message: t('define.message.getFail'),
        description: e.message,
      });
    }
  };

  const renderByPanel = useCallback(() => {
    const PAGES = {
      email: () => (
        <Form.Item
          name='userIds'
          rules={[
            {
              required: true,
              message: t('define.form.select.placeholder'),
            },
          ]}
        >
          <TableTransfer
            leftTableColumns={leftTableColumns}
            rightTableColumns={rightTableColumns}
            dataScourt={list}
            locale={{
              itemUnit: t('define.notification.userIds.selected'),
              itemsUnit: t('define.notification.userIds.unselected'),
              searchPlaceholder: t(
                'define.notification.userIds.searchByFullName',
              ),
            }}
          />
        </Form.Item>
      ),
      wechat: () => (
        <Form.Item
          name='wechat-url'
          label={'URL'}
          rules={[
            {
              required: true,
              message: t('define.form.input.placeholder'),
            },
          ]}
        >
          <Input placeholder={t('define.form.input.placeholder')} />
        </Form.Item>
      ),
      dingtalk: () => (
        <>
          <Form.Item
            name='dingtalk-url'
            label={'URL'}
            rules={[
              {
                required: true,
                message: t('define.form.input.placeholder'),
              },
            ]}
          >
            <Input placeholder={t('define.form.input.placeholder')} />
          </Form.Item>
          <Form.Item
            name='secret'
            label={'Secret'}
            rules={[
              {
                required: true,
                message: t('define.form.input.placeholder'),
              },
            ]}
          >
            <Input placeholder={t('define.form.input.placeholder')} />
          </Form.Item>
        </>
      ),
      slack: () => (
        <Form.Item
          name='slack-url'
          label={'URL'}
          rules={[
            {
              required: true,
              message: t('define.form.input.placeholder'),
            },
          ]}
        >
          <Input placeholder={t('define.form.input.placeholder')} />
        </Form.Item>
      ),
    };
    return PAGES[panel]();
  }, [panel, list]);

  const onfinsh = async () => {
    const params = await form.validateFields();
    if (panel !== 'email') {
      params.url = params[`${panel}-url`];
      delete params[`${panel}-url`];
    }
    operation(
      {
        doWhat: notificationId ? 'edit' : 'add',
        payload: {
          ...params,
          type: panel,
          notificationId,
        },
      },
      toggleVisible,
    );
  };

  return (
    <>
      <Drawer
        title={
          notificationId
            ? t('define.notification.action.modify')
            : t('define.notification.action.add')
        }
        visible={visible}
        onClose={toggleVisible}
        width={800}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={toggleVisible} style={{ marginRight: 8 }}>
              {t('define.ct.import.action.cancel')}
            </Button>
            <Button onClick={onfinsh} type='primary'>
              {t('define.ct.import.action.ok')}
            </Button>
          </div>
        }
      >
        <Form form={form} {...FL}>
          <Form.Item
            label={t('define.name')}
            name='name'
            rules={[
              {
                required: true,
                message: t('define.form.input.placeholder'),
              },
            ]}
          >
            <Input placeholder={t('define.form.input.placeholder')} />
          </Form.Item>
          <Form.Item
            label={t('define.notification.field.eventType')}
            name='eventType'
            rules={[
              {
                required: true,
                message: t('define.form.select.placeholder'),
              },
            ]}
          >
            <Select
              getPopupContainer={triggerNode => triggerNode.parentNode}
              placeholder={t('define.form.select.placeholder')}
              mode={'multiple'}
            >
              {Object.keys(ORG_USER.eventType).map(it => (
                <Option value={it}>{ORG_USER.eventType[it]}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={t('define.type')}
            name='notificationType'
            rules={[
              {
                required: true,
                message: t('define.form.select.placeholder'),
              },
            ]}
            initialValue={'email'}
          >
            <Select
              getPopupContainer={triggerNode => triggerNode.parentNode}
              placeholder={t('define.form.select.placeholder')}
              onChange={e => setPanel(e)}
            >
              {Object.keys(ORG_USER.notificationType).map(it => (
                <Option value={it}>{ORG_USER.notificationType[it]}</Option>
              ))}
            </Select>
          </Form.Item>
          {renderByPanel()}
        </Form>
      </Drawer>
    </>
  );
};

export default NotificationModal;
