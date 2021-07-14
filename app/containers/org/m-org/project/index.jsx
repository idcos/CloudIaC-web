import React, { useState, useEffect } from 'react';
import { Button, Table, Radio, Input, notification, Divider, Popconfirm } from 'antd';
import history from 'utils/history';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Eb_WP } from 'components/error-boundary';
import PageHeaderPlus from 'components/pageHeaderPlus';
import LayoutPlus from 'components/common/layout/plus';
import styles from './styles.less';
import OpModal from 'components/project-modal';

import { pjtAPI, orgsAPI } from 'services/base';
import { CT } from 'constants/types';
import { statusTextCls } from 'utils/util';

const Index = (props) => {
  const { match, routesParams, routes } = props,
    { params } = match;
  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [],
      total: 0
    }),
    [ query, setQuery ] = useState({
      pageNo: 1,
      pageSize: 10
      // status: 'all'
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
      title: '状态',
      render: (text) => {
        return <span>{text === 'enable' ? '正常' : '归档'}</span>; 
      }
    },
    {
      title: '操作',
      width: 90,
      render: (_, record) => {
        return (
          <span className='inlineOp'>
            <a type='link' onClick={() => edit(record)}>编辑</a>
            <Divider type='vertical' />
            {record.status === 'enable' ? 
              <Popconfirm
                title='确定要将项目归档？'
                onConfirm={() => updateStatus(record, 'disable')}
              >
                <a>归档</a>
              </Popconfirm> : 
              <Popconfirm
                title='确定要将项目恢复？'
                onConfirm={() => updateStatus(record, 'enable')}
              >
                <a>恢复</a>
              </Popconfirm>
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
  
  const updateStatus = async(record, status) => {
    let payload = {
      orgId: params.orgId,
      projectId: record.id,
      status
    };
    const res = await pjtAPI.editProject(payload);
    if (res.code != 200) {
      return notification.error({
        message: res.message
      });
    } else {
      notification.success({
        message: '操作成功'
      });
    }
    fetchList();
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
