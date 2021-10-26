import React, { useState, useEffect } from 'react';
import { Button, Select, notification, Table } from 'antd';
import moment from 'moment';

import projectAPI from 'services/project';
import { PROJECT_ROLE } from 'constants/types';

import AddModal from './components/add-modal';

const { Option } = Select;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const User = ({ orgId, projectId }) => {
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
      const res = await projectAPI.listAuthUser({
        currentPage: query.pageNo,
        pageSize: query.pageSize,
        orgId,
        projectId
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

  const onChangeRole = (payload) => {
    operation({ 
      doWhat: 'changeRole', 
      payload
    });
  };

  const operation = async ({ doWhat, payload }, cb) => {
    try {
      const method = {
        changeRole: (param) => projectAPI.updateUserRole(param),
        add: (param) => projectAPI.createUser(param)
      };
      const res = await method[doWhat]({
        ...payload, 
        orgId,
        projectId
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
      dataIndex: 'name',
      title: '姓名',
      ellipsis: true,
      width: 165
    },
    {
      dataIndex: 'email',
      title: '邮箱',
      ellipsis: true,
      width: 256
    },
    {
      dataIndex: 'phone',
      title: '手机号',
      ellipsis: true,
      width: 220
    },
    {
      dataIndex: 'updatedAt',
      title: '加入时间',
      ellipsis: true,
      width: 230,
      render: (text) => moment(text).format(dateFormat)
    },
    {
      title: '项目角色',
      ellipsis: true,
      width: 250,
      render: (record) => {
        const { role, id } = record;
        return (
          <Select 
            style={{ width: '100%' }}
            value={role}
            onChange={(role) => onChangeRole({ role, userId: id })}
          >
            {Object.keys(PROJECT_ROLE).map(it => <Option value={it}>{PROJECT_ROLE[it]}</Option>)}
          </Select>
        );
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
      >添加用户</Button>
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
    {
      visible && <AddModal
        orgId={orgId}
        projectId={projectId}
        reload={fetchList}
        operation={operation}
        visible={visible}
        toggleVisible={toggleVisible}
      />
    }
  </>;
};

export default User;
