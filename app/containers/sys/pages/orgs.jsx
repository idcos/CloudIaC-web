import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import OrgModal from 'components/org-modal';

import { Button, Card, Divider, notification, Popconfirm, Space, Table } from 'antd';
import { orgsAPI } from 'services/base';

const Orgs = ({ title, dispatch }) => {
  const [ loading, setLoading ] = useState(false),
    [ visible, setVisible ] = useState(false),
    [ opt, setOpt ] = useState(null),
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
      const res = await orgsAPI.list({
        ...query
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

  const resfreshGlobalOrg = () => {
    dispatch({
      type: 'global/getOrgs',
      payload: {
        status: 'enable'
      }
    });
  };

  const operation = async ({ doWhat, payload }, cb) => {
    try {
      const method = {
        changeStatus: (param) => orgsAPI.changeStatus(param),
        add: (param) => orgsAPI.create(param)
      };
      const res = await method[doWhat]({
        ...payload
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: '操作成功'
      });
      fetchList();
      resfreshGlobalOrg();
      cb && cb();
    } catch (e) {
      cb && cb(e);
      notification.error({
        message: '操作失败',
        description: e.message
      });
    }
  };

  const toggleVisible = () => {
    if (visible) {
      setOpt(null);
    }
    setVisible(!visible);
  };

  const columns = [
    {
      dataIndex: 'name',
      title: '组织名称',
      width: 170,
      render: (_, record) => <div className='tableRender'>
        <h2 className='reset-styles'>{record.name}</h2>
        <p className='reset-styles'>{record.id}</p>
      </div>
    },
    {
      dataIndex: 'description',
      width: 160,
      title: '描述'
    },
    {
      dataIndex: 'defaultRunnerServiceId',
      title: 'CT Runner',
      width: 220
    },
    {
      dataIndex: 'status',
      width: 104,
      title: '状态',
      render: (text) => <div className='tableRender'>
        <span className={`status-tip ${text == 'disable' ? 'disabled' : 'enabled'}`}>{text == 'disable' ? '禁用' : '启用'}</span>
      </div>
    },
    {
      title: '操作',
      width: 107,
      render: (_, record) => {
        return <Space split={<Divider type='vertical' />}>
          {
            record.status == 'disable' ? <Popconfirm
              title='确定要启用该组织？'
              onConfirm={() => operation({ doWhat: 'changeStatus', payload: { id: record.id, status: 'enable' } })}
            >
              <a>启用</a>
            </Popconfirm> : <Popconfirm
              title='确定要禁用该组织？'
              onConfirm={() => operation({ doWhat: 'changeStatus', payload: { id: record.id, status: 'disable' } })}
            >
              <a className='danger-text'>禁用</a>
            </Popconfirm>
          }
          <a onClick={() => {
            setOpt('edit');
            toggleVisible();
          }}
          >编辑</a>          
        </Space>;
      }
    }
  ];

  return <>
    <Card
      title={title}
      extra={<Button onClick={() => {
        setOpt('add');
        toggleVisible();
      }}
      >创建组织</Button>}
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
      visible && <OrgModal
        visible={visible}
        toggleVisible={toggleVisible}
        opt={opt}
        operation={operation}
      />
    }
  </>;
};

export default connect()(Orgs);
