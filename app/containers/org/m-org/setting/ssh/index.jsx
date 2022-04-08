import React, { useState, useEffect } from 'react';
import { Button, Divider, notification, Space, Table, Modal } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import moment from 'moment';
import keysAPI from 'services/keys';
import getPermission from "utils/permission";
import OpModal from './components/op-modal';

export default ({ orgId, userInfo }) => {

  const { ORG_SET } = getPermission(userInfo);
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
      const res = await keysAPI.list({
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
      title: '密钥名称',
      width: 300,
      ellipsis: true
    },
    {
      dataIndex: 'creator',
      title: '创建人',
      width: 169,
      ellipsis: true
    },
    {
      dataIndex: 'createdAt',
      title: '创建时间',
      width: 169,
      ellipsis: true,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      width: 169,
      ellipsis: true,
      fixed: 'right',
      render: (record) => {
        const creatorIsSelf = record.creatorId === userInfo.id;
        return (
          <Space split={<Divider type='vertical' />}>
            <a 
              disabled={!ORG_SET && !creatorIsSelf}
              onClick={() => del(record)}
            >删除</a>
          </Space>
        );
      }
    }
  ];

  const del = (record) => {
    const { id, name } = record;
    Modal.confirm({
      title: `删除（此操作不可逆）`,
      content: `确定要删除 “${name}” 吗？`,
      icon: <InfoCircleFilled />,
      okText: '确认删除',
      cancelText: '取消',
      cancelButtonProps: {
        className: 'ant-btn-tertiary' 
      },
      onOk: () => operation({ doWhat: 'del', payload: { id } })
    });
  };

  const operation = async ({ doWhat, payload }, cb) => {
    try {
      const method = {
        add: (param) => keysAPI.create(param),
        del: ({ orgId, id }) => keysAPI.del({ orgId, keyId: id })
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
      >添加密钥</Button>
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