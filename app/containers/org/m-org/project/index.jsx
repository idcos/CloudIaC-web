import React, { useState, useEffect } from 'react';
import { Button, Table, Radio, Input, notification, Divider, Menu } from 'antd';
import history from 'utils/history';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Eb_WP } from 'components/error-boundary';
import PageHeaderPlus from 'components/pageHeaderPlus';
import LayoutPlus from 'components/common/layout/plus';
import styles from './styles.less';
import OpModal from './createPages/projectModal';

import { pjtAPI, orgsAPI } from 'services/base';
import { CT } from 'constants/types';
import { statusTextCls } from 'utils/util';

const Index = (props) => {
  const { match, routesParams, routes } = props,
    { params } = match;
  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [
      //   {
      //   "createdAt": "2006-01-02 15:04:05",
      //   "creatorId": "string",
      //   "description": "string",
      //   "id": "x-c3ek0co6n88ldvq1n6ag",
      //   "name": "string",
      //   "orgId": "string",
      //   "status": "string",
      //   "updatedAt": "2006-01-02 15:04:05"
      // }
      ],
      total: 0
    }),
    [ query, setQuery ] = useState({
      pageNo: 1,
      pageSize: 10,
      status: 'all'
    }),
    [ visible, setVisible ] = useState(false),
    [ opt, setOpt ] = useState(null),
    [ record, setRecord ] = useState({});

  const tableFilterFieldName = 'taskStatus';

  const columns = [
    {
      dataIndex: 'name',
      title: '项目名称'
    },
    {
      dataIndex: 'description',
      title: '项目描述'
    },
    {
      dataIndex: 'creator',
      title: '创建人'
    },
    {
      dataIndex: 'taskUpdatedAt',
      title: '创建时间',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      dataIndex: 'status',
      title: '状态'
    },
    {
      title: '操作',
      width: 90,
      render: (_, record) => {
        return (
          <span className='inlineOp'>
            <a type='link' onClick={() => edit(record)}>编辑</a>
            <Divider type='vertical' />
            {record.status === 'enable' ? <a 
              onClick={() => del(record)}
            >归档</a> : <a onClick={() => del(record)}>恢复</a>
            }
          </span>
        );
      }
    }
  ];

  useEffect(() => {
    fetchList();
  }, [query]);

  const edit = (record) => {
    setOpt('edit');
    setRecord(record);
    toggleVisible();
  };
  
  const del = () => {
    return;
  };

  const fetchList = async () => {
    try {
      setLoading(true);
      const { combinedStatus, status, ...restQuery } = query;
      const res = await pjtAPI.projectList({
        ...restQuery,
        [tableFilterFieldName]: combinedStatus || status,
        orgId: params.orgId
      });
      if (res.code != 200) {
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
      setRecord({});
    }
    setVisible(!visible);
  };
  const operation = async ({ action, payload }, cb) => {
    try {
      const method = {
        add: (param) => pjtAPI.createProject(param),
        edit: (param) => pjtAPI.editProject(param)
      };
      let params = {
        ...payload
      };
      action === 'create' && delete params.projectId;
      const res = await method[action](params);
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
  return <LayoutPlus
    extraHeader={<PageHeaderPlus
      title='项目'
      breadcrumb={true}
    />}
  >
    <div className='idcos-card'>
      <div className='btns'>
        <Button type='primary' onClick={() => {
          setOpt('add');
          toggleVisible();
        }}
        >创建项目</Button>
      </div>
      <Table
        columns={columns}
        dataSource={resultMap.list}
        loading={loading}
        onChange={(pagination, filters, sorter, { action }) => {
          if (action == 'filter') {
            const statusFilter = filters[tableFilterFieldName];
            changeQuery({
              status: 'all',
              combinedStatus: statusFilter ? statusFilter.join(',') : undefined
            });
          }
        }}
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
    </div>
    {
      visible && <OpModal
        visible={visible}
        orgId={params.orgId}
        opt={opt}
        curRecord={record}
        toggleVisible={toggleVisible}
        reload={fetchList}
        operation={operation}
      />
    }
    <div className='fn-h-24'></div>
  </LayoutPlus>;
};

export default Eb_WP()(Index);
