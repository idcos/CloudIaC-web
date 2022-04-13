import React, { useState, useEffect } from 'react';
import { Button, Select, notification, Table, Modal } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { t } from 'utils/i18n';
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

  // 移除用户接口
  const {
    run: removeUser
  } = useRequest(
    (userId) => requestWrapper(
      projectAPI.removeUser.bind(null, { orgId, projectId, userId }),
      {
        autoSuccess: true
      }
    ), {
      manual: true,
      onSuccess: () => {
        fetchList();
      }
    }
  );

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
        message: t('define.message.getFail'),
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
        message: t('define.message.opSuccess')
      });
      fetchList();
      cb && cb();
    } catch (e) {
      cb && cb(e);
      notification.error({
        message: t('define.message.getFail'),
        description: e.message
      });
    }
  };

  const remove = ({ id, name }) => {
    Modal.confirm({
      width: 480,
      title: `你确定要移除 ${name} 用户吗？`,
      content: `该操作将同时把该用户从参与的项目中移除`,
      icon: <InfoCircleFilled />,
      okText: '移除',
      cancelText: '取消',
      okButtonProps: {
        danger: true
      },
      cancelButtonProps: {
        className: 'ant-btn-tertiary' 
      },
      onOk: () => {
        return removeUser(id);
      }
    });
  };

  const columns = [
    {
      dataIndex: 'name',
      title: t('define.page.userSet.basic.field.name'),
      ellipsis: true,
      width: 165
    },
    {
      dataIndex: 'email',
      title: t('define.page.userSet.basic.field.email'),
      ellipsis: true,
      width: 256
    },
    {
      dataIndex: 'phone',
      title: t('define.page.userSet.basic.field.phone'),
      ellipsis: true,
      width: 180
    },
    {
      dataIndex: 'updatedAt',
      title: '加入时间',
      ellipsis: true,
      width: 180,
      render: (text) => moment(text).format(dateFormat)
    },
    {
      title: '项目角色',
      ellipsis: true,
      width: 180,
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
    },
    {
      title: t('define.action'),
      width: 169,
      render: (_text, record) => {
        return (
          <div className='common-table-btn-wrapper'>
            <Button type='link' onClick={() => remove(record)}>移除</Button>
          </div>
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
      scroll={{ x: 'min-content' }}
      pagination={{
        current: query.pageNo,
        pageSize: query.pageSize,
        total: resultMap.total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => t('define.pagination.showTotal', { values: { total } }),
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
