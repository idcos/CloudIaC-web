import React, { useEffect, useState } from 'react';
import { Card, Button, Table, notification, Space, Divider, Popconfirm, Modal, Form, Input } from 'antd';
import { orgsAPI } from 'services/base';
import moment from 'moment';

import { ORG_USER } from 'constants/types';

import OpModal from './components/memberModal';

export default ({ title, curOrg }) => {
  const [ loading, setLoading ] = useState(false),
    [ visible, setVisible ] = useState(false),
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
      const res = await orgsAPI.listUser({
        ...query,
        orgId: curOrg.id
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

  const operation = async ({ doWhat, payload }, cb) => {
    try {
      const method = {
        edit: (param) => orgsAPI.editUser(param),
        add: (param) => orgsAPI.addUser(param),
        resetUserPwd: ({ orgId, id }) => orgsAPI.resetUserPwd({ orgId, id }),
        removeUser: ({ orgId, id }) => orgsAPI.removeUser({ orgId, id })
      };
      const res = await method[doWhat]({
        orgId: curOrg.id,
        ...payload
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: '操作成功'
      });
      fetchList();
      cb && cb();
    } catch (e) {
      cb && cb(e);
      notification.error({
        message: '操作失败',
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

  const columns = [
    {
      dataIndex: 'name',
      title: '成员',
      render: (_, record) => <div className='tableRender'>
        <h2 className='reset-styles'>{record.name}</h2>
        <p className='reset-styles'>{record.email}</p>
      </div>
    },
    {
      dataIndex: 'role',
      title: '权限',
      render: (text) => ORG_USER.role[text]
    },
    {
      dataIndex: 'createdAt',
      title: '加入时间',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      render: (_, record) => {
        return <Space split={<Divider type='vertical' />}>
          <a onClick={() => {
            setOpt('edit');
            setCurRecord(record);
            toggleVisible();
          }}
          >编辑</a>
          <Popconfirm
            title='确定要重置密码？'
            onConfirm={() => operation({ doWhat: 'resetUserPwd', payload: { id: record.id } })}
          >
            <a>重置密码</a>
          </Popconfirm>
          <Popconfirm
            title='确定要移除改用户？'
            onConfirm={() => operation({ doWhat: 'removeUser', payload: { id: record.id } })}
          >
            <a>移除</a>
          </Popconfirm>
        </Space>;
      }
    }
  ];

  return <div className='member'>
    <Card
      title={title}
      extra={<Button onClick={() => {
        setOpt('add');
        toggleVisible();
      }}
      >添加成员</Button>}
    >
      <Table
        columns={columns}
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
    </Card>
    {
      visible && <OpModal
        visible={visible}
        toggleVisible={toggleVisible}
        curOrg={curOrg}
        opt={opt}
        curRecord={curRecord}
        operation={operation}
      />
    }
  </div>;
};

