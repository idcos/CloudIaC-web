import React, { useState, useEffect } from 'react';

import { Button, Divider, notification, Popconfirm, Space, Table } from 'antd';
import moment from 'moment';

import tokensAPI from 'services/tokens';

import AddModal from './components/add-modal';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const ApiToken = ({ orgId }) => {
  const [ loading, setLoading ] = useState(false),
    [ visible, setVisible ] = useState(false),
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
      const res = await tokensAPI.listToken({
        currentPage: query.pageNo,
        pageSize: query.pageSize,
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
        message: '获取失败',
        description: e.message
      });
    }
  };

  const toggleVisible = () => setVisible(!visible);

  const changeQuery = (payload) => {
    setQuery({
      ...query,
      ...payload
    });
  };

  const operation = async ({ doWhat, payload }, cb) => {
    try {
      const method = {
        edit: (param) => tokensAPI.editToken(param),
        add: (param) => tokensAPI.createToken(param),
        del: ({ id, orgId }) => tokensAPI.delToken({ id, orgId })
      };
      const res = await method[doWhat]({
        ...payload, 
        orgId
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
      dataIndex: 'key',
      title: 'Token',
      width: 180
    },
    {
      dataIndex: 'description',
      title: '描述',
      width: 180
    },
    {
      dataIndex: 'expiredAt',
      title: '过期时间',
      render: (text) => moment(text).format(dateFormat)
    },
    {
      dataIndex: 'createdAt',
      title: '创建时间',
      render: (text) => moment(text).format(dateFormat)
    },
    {
      dataIndex: 'status',
      title: '状态',
      width: 80,
      render: (text) => <div className='tableRender'>
        <span className={`status-tip ${text == 'disable' ? 'disabled' : 'enabled'}`}>{text == 'disable' ? '禁用' : '启用'}</span>
      </div>
    },
    {
      title: '操作',
      width: 120,
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
    <div style={{ marginBottom: 20 }}>
      <Button 
        type='primary'
        onClick={() => {
          toggleVisible();
        }}
      >创建Token</Button>
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
    {
      visible && <AddModal
        orgId={orgId}
        reload={fetchList}
        operation={operation}
        visible={visible}
        toggleVisible={toggleVisible}
      />
    }
  </>;
};

export default ApiToken;
