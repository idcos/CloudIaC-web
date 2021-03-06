import React, { useState, useEffect } from 'react';
import { Button, Table, notification, Divider, Popconfirm } from 'antd';
import moment from 'moment';
import { connect } from "react-redux";

import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import OpModal from 'components/project-modal';
import projectAPI from 'services/project';

import styles from './styles.less';


const Index = (props) => {
  const { match, dispatch } = props,
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
      title: '项目名称',
      width: 230,
      ellipsis: true
    },
    {
      dataIndex: 'description',
      title: '项目描述',
      width: 264,
      ellipsis: true
    },
    {
      dataIndex: 'creator',
      title: '创建人',
      width: 160,
      ellipsis: true
    },
    {
      dataIndex: 'createdAt',
      title: '创建时间',
      width: 210,
      ellipsis: true,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      dataIndex: 'status',
      title: '状态',
      width: 100,
      ellipsis: true,
      render: (text) => {
        return <span>{text === 'enable' ? '正常' : '归档'}</span>; 
      }
    },
    {
      title: '操作',
      width: 169,
      ellipsis: true,
      fixed: 'right',
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

  // 重新刷新全局的projects
  const reloadGlobalProjects = () => {
    dispatch({
      type: 'global/getProjects',
      payload: {
        orgId: params.orgId
      }
    });
  };
  
  const updateStatus = async(record, status) => {
    let payload = {
      orgId: params.orgId,
      projectId: record.id,
      status
    };
    const res = await projectAPI.editProject(payload);
    if (res.code != 200) {
      return notification.error({
        message: res.message
      });
    } else {
      notification.success({
        message: '操作成功'
      });
      reloadGlobalProjects();
    }
    fetchList();
  };

  const fetchList = async () => {
    try {
      setLoading(true);
      const { combinedStatus, status, ...restQuery } = query;
      const res = await projectAPI.projectList({
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
        add: (param) => projectAPI.createProject(param),
        edit: (param) => projectAPI.editProject(param)
      };
      let params = {
        ...payload
      };
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
  return <Layout
    extraHeader={<PageHeader
      title='项目'
      breadcrumb={true}
    />}
  >
    <div className='idcos-card'>
      <div className={styles.projectList}>
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
          scroll={{ x: 'min-content' }}
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
      </div>
    </div>
    
  </Layout>;
};

export default connect()(
  Eb_WP()(Index)
);
