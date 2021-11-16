import React, { useState, useEffect } from 'react';
import { Button, Divider, notification, Popconfirm, Space, Table } from 'antd';
import moment from 'moment';
import tokensAPI from 'services/tokens';
import TokenForm from './components/add-modal';
import Popover from 'components/Popover';

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
      width: 286
    },
    {
      dataIndex: 'description',
      title: '描述',
      width: 210,
      ellipsis: true
    },
    {
      dataIndex: 'expiredAt',
      title: '过期时间',
      width: 150,
      ellipsis: true,
      render: (text) => text ? moment(text).format(dateFormat) : '-'
    },
    {
      dataIndex: 'createdAt',
      title: '创建时间',
      width: 150,
      ellipsis: true,
      render: (text) => moment(text).format(dateFormat)
    },
    {
      dataIndex: 'status',
      title: '状态',
      width: 132,
      ellipsis: true,
      render: (text) => <div className='tableRender'>
        <span className={`status-tip ${text == 'disable' ? 'disabled' : 'enabled'}`}>{text == 'disable' ? '禁用' : '启用'}</span>
      </div>
    },
    {
      title: '操作',
      width: 169,
      ellipsis: true,
      fixed: 'right',
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
              <a>禁用</a>
            </Popconfirm>
          }
          <Popconfirm
            title='确定删除该资源账号？'
            onConfirm={() => operation({ doWhat: 'del', payload: { id: record.id } })}
          >
            <a>删除</a>
          </Popconfirm>
        </Space>;
      }
    }
  ];

  return <>
    <div style={{ marginBottom: 20 }}>
      <Popover 
        placement='right' 
        visible={visible}
        arrowPointAtCenter={true}
        autoAdjustOverflow={true}
        trigger={'click'}
        close={toggleVisible}
        formContent={<TokenForm 
          orgId={orgId}
          reload={fetchList}
          operation={operation}
          visible={visible}
          toggleVisible={toggleVisible}
        />}
      >
        <Button 
          type='primary'
          onClick={() => {
            toggleVisible();
          }}
        >创建Token</Button>
      </Popover>
    </div>
    <Table
      columns={columns}
      dataSource={resultMap.list}
      loading={loading}
      scroll={{ x: 'min-content', y: 570 }}
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
  </>;
};

export default ApiToken;
