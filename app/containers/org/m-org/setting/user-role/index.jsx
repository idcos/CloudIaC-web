import React, { useEffect, useState } from 'react';
import { Button, Table, notification, Space, Dropdown, Popconfirm, Modal, Menu, Tabs } from 'antd';
import { InfoCircleFilled, DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import orgsAPI from 'services/orgs';
import userAPI from 'services/user';
import { ORG_USER } from 'constants/types';
import EllipsisText from 'components/EllipsisText';
import getPermission from "utils/permission";
import { t } from 'utils/i18n';
import OpModal from './components/memberModal';
import LdapModal from './components/ldapModal';

export default ({ userInfo, orgId }) => {

  const { ORG_SET } = getPermission(userInfo);
  const [ loading, setLoading ] = useState(false),
    [ visible, setVisible ] = useState(false),
    [ tabKey, setTabKey ] = useState('user'),
    [ ldapVisible, setLdapVisible ] = useState(false),
    [ isBatch, setIsBatch ] = useState(false),
    [ opt, setOpt ] = useState(null),
    [ curRecord, setCurRecord ] = useState(null),
    [ resultMap, setResultMap ] = useState({
      list: [],
      total: 0
    }),
    [ query, setQuery ] = useState({
      pageNo: 1,
      pageSize: 10
    });

  useEffect(() => {
    fetchList();
  }, [query]);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await userAPI.list({
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
      setLoading(false);
      notification.error({
        message: t('define.message.getFail'),
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

  const operation = async ({ doWhat, payload }, cb) => {
    try {
      const method = {
        edit: (param) => orgsAPI.updateUser(param),
        add: (param) => orgsAPI.inviteUser(param),
        ldapAdd: (param) => orgsAPI.inviteLdapUser(param),
        batchAdd: (param) => orgsAPI.batchInviteUser(param),
        resetUserPwd: ({ orgId, id }) => userAPI.resetUserPwd({ orgId, id }),
        removeUser: ({ orgId, id }) => orgsAPI.removeUser({ orgId, id }),
        removeLdapUser: ({ orgId, id }) => orgsAPI.removeLdapUser({ orgId, id })
      };
      const res = await method[doWhat]({
        orgId,
        ...payload
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: t('define.message.opSuccess')
      });
      fetchList();
      cb && cb();
    } catch (e) {
      cb && cb(e);
      notification.error({
        message: t('define.message.getFail'),
        description: e.message
      });
    }
  };

  const toggleVisible = () => {
    if (visible) {
      setCurRecord(null);
      setOpt(null);
    }
    setVisible(!visible);
  };

  const toggleLdapVisible = () => {
    if (visible) {
      setCurRecord(null);
      setOpt(null);
    }
    setLdapVisible(!ldapVisible);
  };

  const remove = ({ id, name }) => {
    Modal.confirm({
      width: 480,
      title: `${t('define.org.user.action.remove.confirm.title.prefix')} ${name} ${t('define.org.user.action.remove.confirm.title.suffix')}`,
      content: t('define.org.user.action.remove.confirm.content'),
      icon: <InfoCircleFilled />,
      okText: t('define.org.user.action.remove'),
      okButtonProps: {
        danger: true
      },
      cancelButtonProps: {
        className: 'ant-btn-tertiary' 
      },
      onOk: () => {
        return operation({ doWhat: 'removeLdapUser', payload: { id } });
      }
    });
  };

  const removeOU = ({ id, name }) => {
    Modal.confirm({
      width: 480,
      title: `${t('define.org.user.action.remove.confirm.title.prefix')} ${name} ?`,
      content: t('define.org.user.action.remove.confirm.content'),
      icon: <InfoCircleFilled />,
      okText: t('define.org.user.action.remove'),
      okButtonProps: {
        danger: true
      },
      cancelButtonProps: {
        className: 'ant-btn-tertiary' 
      },
      onOk: () => {
        return operation({ doWhat: 'removeUser', payload: { id } });
      }
    });
  };

  const columns = [
    {
      dataIndex: 'name',
      title: t('define.page.userSet.basic.field.name'),
      width: 268,
      ellipsis: true,
      render: (_, record) => <div className='tableRender'>
        <h2 className='reset-styles'><EllipsisText>{record.name}</EllipsisText></h2>
        <p className='reset-styles'><EllipsisText>{record.email}</EllipsisText></p>
      </div>
    },
    {
      dataIndex: 'phone',
      title: t('define.page.userSet.basic.field.phone'),
      width: 178,
      ellipsis: true
    },
    {
      dataIndex: 'createdAt',
      title: t('define.org.user.createdAt'),
      width: 212,
      ellipsis: true,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      dataIndex: 'role',
      title: t('define.org.user.role'),
      width: 160,
      ellipsis: true,
      render: (text) => ORG_USER.role[text]
    },
    {
      title: t('define.action'),
      width: 180,
      ellipsis: true,
      fixed: 'right',
      render: (_, record) => {
        return (
          <div className='common-table-btn-wrapper'>
            <Button 
              type='link' 
              disabled={!ORG_SET}
              onClick={() => {
                setOpt('edit');
                setCurRecord(record);
                toggleVisible();
                setIsBatch(false);
              }}
            >{t('define.action.modify')}</Button>
            <Popconfirm
              title={t('define.org.user.action.resetPwd.confirm.title')}
              onConfirm={() => operation({ doWhat: 'resetUserPwd', payload: { id: record.id } })}
              disabled={!ORG_SET}
            >
              <Button type='link' disabled={!ORG_SET}>{t('define.org.user.action.resetPwd')}</Button>
            </Popconfirm>
            <Button type='link' disabled={!ORG_SET} onClick={() => remove(record)}>{t('define.org.user.action.remove')}</Button>
          </div>
        );
      }
    }
  ];

  const OUColumns = [
    {
      dataIndex: 'name',
      title: 'OU',
      width: 268,
      ellipsis: true
    },
    {
      dataIndex: 'role',
      title: t('define.org.user.role'),
      width: 160,
      ellipsis: true,
      render: (text) => ORG_USER.role[text]
    },
    {
      dataIndex: 'createdAt',
      title: t('define.org.user.createdAt'),
      width: 212,
      ellipsis: true,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: t('define.action'),
      width: 180,
      ellipsis: true,
      fixed: 'right',
      render: (_, record) => {
        return (
          <div className='common-table-btn-wrapper'>
            <Button type='link' disabled={!ORG_SET} onClick={() => removeOU(record)}>{t('define.org.user.action.remove')}</Button>
          </div>
        );
      }
    }
  ];



  const invitation = (e) => {
    switch (e.key) {
    case 'invitation':
      setOpt('add');
      toggleVisible();
      setIsBatch(false);
      break;
    case 'batch-invitation':
      setOpt('add');
      toggleVisible();
      setIsBatch(true);
      break;
    case 'ldap-invitation':
      setOpt('ldapAdd');
      toggleLdapVisible();
      break;
    default:
      break;
    }
  };

  const menu = (
    <Menu onClick={invitation}>
      <Menu.Item key='invitation'>{t('define.org.user.action.add')}</Menu.Item>
      <Menu.Item key='batch-invitation'>{t('define.org.user.action.batchAdd')}</Menu.Item>
      <Menu.Item key='ldap-invitation'>{t('define.org.user.action.ldapAdd')}</Menu.Item>
    </Menu>
  );

  return <div>
    <div style={{ marginBottom: 20 }}>
      <Dropdown overlay={menu}>
        <Button>
          <Space>
            {t('define.org.user.action.addWrapper')}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </div>
    <Tabs activeKey={tabKey} onChange={setTabKey}>
      <Tabs.TabPane tab={t('define.user')} key='user'>
        <Table
          columns={columns}
          dataSource={resultMap.list}
          loading={loading}
          scroll={{ x: 'min-content' }}
          pagination={{
            current: query.pageNo,
            pageSize: query.pageSize,
            total: resultMap.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => t('define.pagination.showTotal', { values: { total } }),
            onChange: (page, pageSize) => {
              changeQuery({
                pageNo: page,
                pageSize
              });
            }
          }}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab='LDAP/OU' key='ou'>
        <Table
          columns={OUColumns}
          dataSource={resultMap.list}
          loading={loading}
          scroll={{ x: 'min-content' }}
          pagination={{
            current: query.pageNo,
            pageSize: query.pageSize,
            total: resultMap.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => t('define.pagination.showTotal', { values: { total } }),
            onChange: (page, pageSize) => {
              changeQuery({
                pageNo: page,
                pageSize
              });
            }
          }}
        />
      </Tabs.TabPane>
    </Tabs>
   
    {
      visible && <OpModal
        visible={visible}
        toggleVisible={toggleVisible}
        opt={opt}
        curRecord={curRecord}
        operation={operation}
        isBatch={isBatch}
        ORG_SET={ORG_SET}
      />
    }
    {
      ldapVisible && <LdapModal
        visible={ldapVisible}
        toggleVisible={toggleLdapVisible}
        opt={opt}
        curRecord={curRecord}
        operation={operation}
        isBatch={isBatch}
        ORG_SET={ORG_SET}
      />
    }
  </div>;
};

