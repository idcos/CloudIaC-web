import React, { useState, useEffect } from 'react';
import { Button, notification, Table } from 'antd';
import notificationsAPI from 'services/notifications';

import { ORG_USER } from 'constants/types';
import moment from 'moment';

import AddModal from './components/notificationModal';

export default ({ orgId }) => {
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
      const res = await notificationsAPI.notificationList({
        ...query,
        orgId
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setResultMap({
        list: res.result || []
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

  const toggleVisible = () => setVisible(!visible);

  const columns = [
    {
      dataIndex: 'name',
      title: '成员'
    },
    {
      dataIndex: 'eventType',
      title: '通知类型',
      render: (text) => ORG_USER.notificationType[text]
    },
    {
      dataIndex: '',
      title: '加入时间',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      render: (_, record) => <a
        className='danger-text'
        onClick={() => {
          operation({ doWhat: 'del', payload: { id: record.id } });
        }}
      >
        移除
      </a>
    }
  ];

  const operation = async ({ doWhat, payload }, cb) => {
    try {
      const method = {
        add: (param) => notificationsAPI.createNotification(param),
        del: ({ orgId, id }) => notificationsAPI.delNotification({ orgId, id })
      };
      const res = await method[doWhat]({
        orgId,
        notificationType: 'email',
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
      console.log(e);
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
        onClick={toggleVisible}
      >添加通知人</Button>
    </div>
    <Table
      columns={columns}
      dataSource={resultMap.list}
      loading={loading}

      /*pagination={{
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
      }}*/
      pagination={false}
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
  </div>;
};
