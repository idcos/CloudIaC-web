import React, { useState, useEffect } from 'react';
import { Button, Card, Divider, notification, Popconfirm, Space, Table, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { orgsAPI } from 'services/base';
import OpModal from './components/vcsModal';
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
      currentPage: 1,
      pageSize: 10
    });

  useEffect(() => {
    fetchList();
  }, [query]);

  const fetchList = async () => {
    // return console.warn('待联调接口');
    try {
      setLoading(true);
      const res = await orgsAPI.searchVcs({
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
      title: '名称'
    },
    {
      dataIndex: 'type',
      title: '类型'
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
      title: '地址',
      render: (_, record) => <span>{record.ctServiceIds && record.ctServiceIds.length || 0}个</span>
    },
    {
      dataIndex: 'createdAt',
      title: 'Token',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      render: (_, record) => {
        return <Space split={<Divider type='vertical' />}>
          {
            record.status == 'disable' ? 
              <a onClick={() => operation({ doWhat: 'edit', payload: { id: record.id, status: 'enable' } })}>启用</a>
           	 	: <a className='danger-text' onClick={() => disableConfirm(record)}>禁用</a>
          }
          <a className='danger-text' onClick={() => delConfirm(record)}>删除</a>
        </Space>;
      }
    }
  ];

  const disableConfirm = (record) => {
    Modal.confirm({
      title: `你确定要禁用${record.name}吗？`,
      icon: <ExclamationCircleOutlined />,
      content: `禁用将导致引用该VCS仓库的云模板不可用，确定要禁用吗`,
      okText: '确认',
    	cancelText: '取消',
      onOk: () => {
        operation({ doWhat: 'edit', payload: { id: record.id, status: 'disable' } });
      }
    });
  };

  const delConfirm = (record) => {
    Modal.confirm({
      title: `你确定要删除${record.name}吗？`,
      icon: <ExclamationCircleOutlined />,
      content: `删除将导致引用该VCS仓库的云模板不可用，确定要删除吗`,
      okText: '确认',
    	cancelText: '取消',
      onOk: () => {
        operation({ doWhat: 'del', payload: { id: record.id } });
      }
    });
  };

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
      >添加VCS</Button>}
    >
      <Table
        columns={columns}
        dataSource={resultMap.list}
        loading={loading}
        pagination={{
          current: query.currentPage,
          pageSize: query.pageSize,
          total: resultMap.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共${total}条`,
          onChange: (page, pageSize) => {
            changeQuery({
              currentPage: page,
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