import React, { useState, useEffect } from 'react';

import { Alert, Button, Card, Divider, notification, Popconfirm, Space, Table } from 'antd';
import moment from 'moment';

import { sysAPI } from 'services/base';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const ApiToken = ({ title }) => {
  const [ loading, setLoading ] = useState(false),
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
      const res = await sysAPI.listToken({
        ...query
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
        edit: (param) => sysAPI.editToken(param),
        add: (param) => sysAPI.createToken(),
        del: ({ id }) => sysAPI.delToken(id)
      };
      const res = await method[doWhat]({
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

  const columns = [
    {
      dataIndex: 'token',
      title: 'Token',
      width: 100
    },
    {
      dataIndex: 'status',
      title: '状态',
      render: (text) => <div className='tableRender'>
        <span className={`status-tip ${text == 'disable' ? 'disabled' : 'enabled'}`}>{text == 'disable' ? '禁用' : '启用'}</span>
      </div>
    },
    {
      dataIndex: 'updatedAt',
      title: '上次使用时间',
      render: (text) => moment(text).format(dateFormat)
    },
    {
      dataIndex: 'createdAt',
      title: '创建时间',
      render: (text) => moment(text).format(dateFormat)
    },
    {
      title: '操作',
      render: (_, record) => {
        return <Space split={<Divider type='vertical' />}>
          {
            record.status == 'disable' ? <Popconfirm
              title='确定要启用该资源账号？'
              onConfirm={() => operation({ doWhat: 'edit', payload: { id: record.id, status: 'enable' } })}
            >
              <a>启用</a>
            </Popconfirm> : <Popconfirm
              title='确定要禁用该资源账号？'
              onConfirm={() => operation({ doWhat: 'edit', payload: { id: record.id, status: 'disable' } })}
            >
              <a className='danger-text'>禁用</a>
            </Popconfirm>
          }
          <Popconfirm
            title='确定删除该资源账号？'
            onConfirm={() => operation({ doWhat: 'del', payload: { id: record.id } })}
          >
            <a className='danger-text'>删除</a>
          </Popconfirm>
        </Space>;
      }
    }
  ];

  return <>
    <Card
      title={title}
      extra={<Button onClick={() => {
        operation({
          doWhat: 'add'
        });
      }}
      >创建Token</Button>}
    >
      <div className='gap'>
        <Alert
          message='Token用于API访问你的全部数据，请注意保密，如有泄漏，请禁用/删除等操作'
          type='warning'
          showIcon={true}
          closable={true}
        />
      </div>
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
  </>;
};

export default ApiToken;
