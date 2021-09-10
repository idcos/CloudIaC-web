import React, { useState, useEffect, useCallback } from 'react';
import { Form, Tabs, Drawer, notification, Button, Select, Card, Input } from "antd";
import userAPI from 'services/user';
import notificationsAPI from 'services/notifications';


import { ORG_USER } from 'constants/types';

import styles from './style.less';
import TableTransfer from 'components/table-transfer';

const { Option } = Select;

const FL = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 }
};

const PL = {
  wrapperCol: { span: 24 }
};

export default ({ orgId, operation, visible, toggleVisible, notificationId }) => {

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

  const [ panel, setPanel ] = useState('email'),
    [ info, setInfo ] = useState([]),
    [ list, setList ] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserList();
    if (notificationId) {
      getDetail();
    }
  }, []);

  const getDetail = async() => {
    try {
      const res = await notificationsAPI.detailNotification({
        notificationId,
        orgId
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
        message: '获取失败',
        description: e.message
      });
    }
  };

  const fetchUserList = async () => {
    try {
      const res = await userAPI.list({
        pageSize: 99999,
        currentPage: 1,
        orgId
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      let lists = (res.result.list || []).map(it => ({ name: it.name, email: it.email, key: it.id }));
      setList(lists || []);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const renderByPanel = useCallback(() => {
    const PAGES = {
      email: () => <Form.Item
        name='userIds'
        {...PL}
        rules={[
          {
            required: true,
            message: '请选择发送人'
          }
        ]}
      >
        <TableTransfer 
          leftTableColumns={leftTableColumns}
          rightTableColumns={rightTableColumns}
          dataScourt={list}
          locale={{ itemUnit: '已选', itemsUnit: '未选', searchPlaceholder: '请输入姓名搜索' }}
        />
      </Form.Item>,
      wechat: () => <Form.Item
        name='wechat-url'
        label={'URL'}
        {...PL}
        rules={[
          {
            required: true,
            message: '请输入url'
          }
        ]}
      >
        <Input />
      </Form.Item>,
      dingtalk: () => <><Form.Item
        name='dingtalk-url'
        label={'URL'}
        {...PL}
        rules={[
          {
            required: true,
            message: '请输入url'
          }
        ]}
      >
        <Input />
      </Form.Item><Form.Item
        name='secret'
        label={'Secret'}
        {...PL}
        rules={[
          {
            required: true,
            message: '请输入secret'
          }
        ]}
      >
        <Input />
      </Form.Item></>,
      slack: () => <Form.Item
        name='slack-url'
        label={'URL'}
        {...PL}
        rules={[
          {
            required: true,
            message: '请输入url'
          }
        ]}
      >
        <Input />
      </Form.Item>
    };
    return PAGES[panel]();
  }, [ panel, list ]);
  
  const onfinsh = async() => {
    const params = await form.validateFields();
    params.notificationType = panel;
    if (panel !== 'email') {
      params.url = params[`${panel}-url`]; 
      delete params[`${panel}-url`];
    }
    operation({
      doWhat: 'add',
      payload: {
        ...params
      }
    }, toggleVisible);
  };

  return <>
    <Drawer
      title='添加通知'
      visible={visible}
      onClose={toggleVisible}
      width={800}
      footer={
        <div
          style={{
            textAlign: 'right'
          }}
        >
          <Button onClick={toggleVisible} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button onClick={onfinsh} type='primary'>
            确认
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        {...FL}
      >
        <Form.Item
          label='名称'
          name='name'
          rules={[
            {
              required: true,
              message: '请输入名称'
            }
          ]}
        >
          <Input placeholder='请输入通知名称' />
        </Form.Item>
        <Form.Item
          label='事件类型'
          name='eventType'
          rules={[
            {
              required: true,
              message: '请选择事件类型'
            }
          ]}
        >
          <Select 
            getPopupContainer={triggerNode => triggerNode.parentNode}
            placeholder='请选择事件类型'
            mode={'multiple'}
          >
            {Object.keys(ORG_USER.notificationType).map(it => <Option value={it}>{ORG_USER.notificationType[it]}</Option>)}
          </Select>
        </Form.Item>
        <div style={{ marginTop: 20 }}>
          <div className={styles.depolyDetail}>
            <Tabs
              type={'card'}
              tabBarStyle={{ backgroundColor: '#fff', marginBottom: 20 }}
              animated={false}
              renderTabBar={(props, DefaultTabBar) => {
                return (
                  <div style={{ marginBottom: -16 }}>
                    <DefaultTabBar {...props} />
                  </div>
                );
              }}
              activeKey={panel}
              onChange={(k) => {
                setPanel(k); 
                form.setFieldsValue({ [`${k}-url`]: '' });
              }}
            >
              {Object.keys(ORG_USER.subNavs).map((it) => (
                <Tabs.TabPane
                  tab={ORG_USER.subNavs[it]}
                  key={it}
                />
              ))}
            </Tabs>
            <Card style={{ height: 500 }} headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={'设置内容'}>
              {renderByPanel()}
            </Card>
          </div>
        </div>
      </Form>
    </Drawer>
  </>;
};
