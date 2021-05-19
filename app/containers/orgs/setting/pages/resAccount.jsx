import React, { useState, useEffect } from 'react';
import { Button, Card, Divider, notification, Popconfirm, Space, Table } from 'antd';
import { orgsAPI } from 'services/base';

import OpModal from './components/resAccountModal';
import moment from 'moment';

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
      const res = await orgsAPI.resAccountList({
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

  const toggleVisible = () => {
    if (visible) {
      setOpt(null);
      setCurRecord(null);
    }
    setVisible(!visible);
  };

  const columns = [
    {
      dataIndex: 'name',
      title: '资源名称'
    },
    {
      dataIndex: 'status',
      title: '状态',
      render: (text) => <div className='tableRender'>
        <span className={`status-tip ${text == 'disable' ? 'disabled' : 'enabled'}`}>{text == 'disable' ? '禁用' : '启用'}</span>
      </div>
    },
    {
      dataIndex: 'ctServiceIds',
      title: 'CT Runner数量',
      render: (_, record) => <span>{record.ctServiceIds.length}个</span>
    },
    {
      dataIndex: 'createdAt',
      title: '创建时间',
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

  const operation = async ({ doWhat, payload }, cb) => {
    try {
      const method = {
        add: (param) => orgsAPI.resAccountCreate(param),
        del: ({ orgId, id }) => orgsAPI.resAccountDel({ orgId, id }),
        edit: (param) => orgsAPI.resAccountUpdate(param)
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

  return <div>
    <Card
      title={title}
      extra={<Button onClick={() => {
        setOpt('add');
        toggleVisible();
      }}
      >创建账号</Button>}
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
        opt={opt}
        toggleVisible={toggleVisible}
        curOrg={curOrg}
        reload={fetchList}
        operation={operation}
        curRecord={curRecord}
      />
    }
  </div>;
};

