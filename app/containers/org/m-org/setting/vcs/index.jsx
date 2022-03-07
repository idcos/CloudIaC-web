import React, { useState, useEffect } from 'react';
import { Button, Card, Divider, notification, Space, Table, Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import vcsAPI from 'services/vcs';
import OpModal from 'components/vcs-modal';

export default ({ title, orgId }) => {
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
    try {
      setLoading(true);
      const res = await vcsAPI.searchVcs({
        ...query,
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
      title: '名称',
      width: 200,
      ellipsis: true
    },
    {
      dataIndex: 'vcsType',
      title: '类型',
      width: 100,
      ellipsis: true
    },
    {
      dataIndex: 'status',
      title: '状态',
      width: 100,
      ellipsis: true,
      render: (text) => <div className='tableRender'>
        <span className={`status-tip ${text == 'disable' ? 'disabled' : 'enabled'}`}>{text == 'disable' ? '禁用' : '启用'}</span>
      </div>
    },
    {
      dataIndex: 'address',
      title: '地址',
      width: 230,
      ellipsis: true
    },
    {
      title: '操作',
      width: 169,
      ellipsis: true,
      fixed: 'right',
      render: (_, record) => {
        return <Space split={<Divider type='vertical' />}>
          <a 
            onClick={() => {
              setOpt('edit');
              toggleVisible();
              setCurRecord(record);
            }}
          >编辑</a>
          {
            record.status == 'disable' ? 
              <a onClick={() => operation({ doWhat: 'edit', payload: { id: record.id, status: 'enable' } })}>启用</a>
           	 	: <a onClick={() => disableConfirm(record)}>禁用</a>
          }
          <a onClick={() => delConfirm(record)}>删除</a>
        </Space>;
      }
    }
  ];

  const disableConfirm = (record) => {
    const { name, id } = record;
    Modal.confirm({
      width: 480,
      title: `你确定要禁用${name}吗？`,
      icon: <ExclamationCircleFilled />,
      content: `禁用将导致引用该VCS仓库的云模板不可用，确定要禁用吗`,
      okText: '确认',
    	cancelText: '取消',
      onOk: () => {
        operation({ doWhat: 'edit', payload: { id, status: 'disable' } });
      }
    });
  };

  const delConfirm = (record) => {
    const { name, id } = record;
    Modal.confirm({
      width: 480,
      title: `你确定要删除${name}吗？`,
      icon: <ExclamationCircleFilled />,
      content: `删除将导致引用该VCS仓库的云模板不可用，确定要删除吗`,
      okText: '确认',
    	cancelText: '取消',
      onOk: () => {
        operation({ doWhat: 'del', payload: { id } });
      }
    });
  };

  const operation = async ({ doWhat, payload }, cb) => {
    try {
      const method = {
        add: (param) => vcsAPI.createVcs(param),
        del: ({ orgId, id }) => vcsAPI.deleteVcs({ orgId, id }),
        edit: (param) => vcsAPI.updateVcs(param)
      };
      const res = await method[doWhat]({
        orgId,
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
    <div style={{ marginBottom: 20 }}>
      <Button 
        type='primary'
        onClick={() => {
          setOpt('add');
          toggleVisible();
        }}
      >添加VCS</Button>
    </div>
    <Table
      columns={columns}
      dataSource={resultMap.list}
      loading={loading}
      scroll={{ x: 'min-content' }}
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
    {
      visible && <OpModal
        visible={visible}
        opt={opt}
        toggleVisible={toggleVisible}
        operation={operation}
        curRecord={curRecord}
      />
    }
  </div>;
};