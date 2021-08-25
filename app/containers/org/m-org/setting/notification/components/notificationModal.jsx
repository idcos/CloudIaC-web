import React, { useState, useEffect, useCallback } from 'react';
import { Form, Tabs, Drawer, notification, Row, Select, Card, Input } from "antd";
import userAPI from 'services/user';

import { ORG_USER } from 'constants/types';

import styles from './style.less';
import TableTransfer from './email';

const { Option } = Select;

const FL = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 }
};

const PL = {
  wrapperCol: { span: 24 }
};
const subNavs = {
  email: '邮件',
  wechat: '企业微信',
  dingTalk: '钉钉',
  slack: 'Slack'
};

export default ({ orgId, operation, visible, toggleVisible }) => {
  const [ selectedRowKeys, setSelectedRowKeys ] = useState([]),
    [ panel, setPanel ] = useState('email'),
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

  const renderByPanel = useCallback(() => {
    const PAGES = {
      email: () => <Form.Item
        name='email'
        {...PL}
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
      >
        <TableTransfer />
      </Form.Item>,
      wechat: () => <Form.Item
        name='eventType'
        label={'URL'}
        {...PL}
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
      >
        <Input />
      </Form.Item>,
      dingTalk: () => <><Form.Item
        name='eventType'
        label={'URL'}
        {...PL}
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
      >
        <Input />
      </Form.Item><Form.Item
        name='eventType'
        label={'URL'}
        {...PL}
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
      >
        <Input />
      </Form.Item></>,
      slack: () => <Form.Item
        name='eventType'
        label={'URL'}
        {...PL}
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
      >
        <Input />
      </Form.Item>
    };
    return PAGES[panel]();
  }, [panel]);
  

  return <>
    <Drawer
      title='添加通知'
      visible={visible}
      onCancel={toggleVisible}
      okButtonProps={{
        disabled: !selectedRowKeys.length
      }}
      width={800}
      onOk={onOk}
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
              message: '请输入'
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
              }}
            >
              {Object.keys(subNavs).map((it) => (
                <Tabs.TabPane
                  tab={subNavs[it]}
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
