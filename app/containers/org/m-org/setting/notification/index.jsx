import React, { useState, useEffect } from 'react';
import { Button, notification, Table, Divider, Popconfirm } from 'antd';
import notificationsAPI from 'services/notifications';
import { ORG_USER } from 'constants/types';
import moment from 'moment';
import AddModal from './components/notificationModal';

export default ({ orgId }) => {
  const [ loading, setLoading ] = useState(false),
    [ visible, setVisible ] = useState(false),
    [ notificationId, setNotificationId ] = useState(),
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
      const res = await notificationsAPI.notificationList({
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
    setVisible(false); 
    setNotificationId();
  };

  const columns = [
    {
      dataIndex: 'name',
      title: '名称',
      width: 165,
      ellipsis: true
    },
    {
      dataIndex: 'notificationType',
      title: '类型',
      width: 149,
      ellipsis: true,
      render: (text) => ORG_USER.notificationType[text]
    },
    {
      dataIndex: 'eventType',
      title: '事件类型',
      width: 277,
      ellipsis: true,
      render: (text) => (text || []).map(it => ORG_USER.eventType[it]).join('、')
    },
    {
      dataIndex: 'creatorName',
      title: '创建人',
      width: 169,
      ellipsis: true
    },
    {
      dataIndex: 'createdAt',
      title: '创建时间',
      width: 219,
      ellipsis: true,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      width: 169,
      ellipsis: true,
      fixed: 'right',
      render: (_, record) => <span>
        <a
          onClick={() => {
            setVisible(true);
            setNotificationId(record.id);
          }}
        >
          编辑
        </a>
        <Divider type={'vertical'}/>
        <Popconfirm
          title='确定要删除该通知？'
          onConfirm={() => operation({ doWhat: 'del', payload: { id: record.id } })}
        >
          <a>
            删除
          </a>
        </Popconfirm>
      </span> 
    }
  ];

  const operation = async ({ doWhat, payload }, cb) => {
    try {
      const method = {
        add: (param) => notificationsAPI.createNotification(param),
        edit: (param) => notificationsAPI.updateNotification(param),
        del: ({ orgId, id }) => notificationsAPI.delNotification({ orgId, id })
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
          setVisible(true);
        }}
      >添加通知</Button>
    </div>
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
        notificationId={notificationId}
      />
    }
  </div>;
};
