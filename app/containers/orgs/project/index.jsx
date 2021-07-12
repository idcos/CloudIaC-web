import React, { useState, useEffect } from 'react';
import { Button, Table, Radio, Input, notification, Divider, Menu } from 'antd';
import history from 'utils/history';
import { Link } from 'react-router-dom';
import moment from 'moment';

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';
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
      list: [{
        "createdAt": "2006-01-02 15:04:05",
        "creatorId": "string",
        "description": "string",
        "id": "x-c3ek0co6n88ldvq1n6ag",
        "name": "string",
        "orgId": "string",
        "status": "string",
        "updatedAt": "2006-01-02 15:04:05"
      }],
      total: 0
    }),
    [ query, setQuery ] = useState({
      pageNo: 1,
      pageSize: 10,
      status: 'all'
    }),
    [ visible, setVisible ] = useState(false),
    [ opt, setOpt ] = useState(null);
  const tableFilterFieldName = 'taskStatus';

  const columns = [
    {
      dataIndex: 'name',
      title: '项目名称',
      render: (text, record) => <Link to={`/org/${params.orgId}/ct/${record.id}/overview`}>{text}</Link>
    },
    {
      dataIndex: 'description',
      title: '项目描述'
    },
    {
      dataIndex: tableFilterFieldName,
      title: '最后运行状态',
      filters: query.status == 'all' && Object.keys(CT.taskStatus)
        .filter(it => it !== 'all')
        .map(it => ({ text: CT.taskStatus[it], value: it })),
      width: 150,
      render: (text) => <div className='tableRender'>
        <span className={`status-text ${statusTextCls(text).cls}`}>{CT.taskStatusIcon[text]} {CT.taskStatus[text]}</span>
      </div>
    },
    {
      dataIndex: 'taskUpdatedAt',
      title: '创建时间',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      dataIndex: 'creator',
      title: '创建人'
    },
    {
      title: '操作',
      // width: 90,
      width: 180,
      render: (_, record) => {
        return (
          <span className='inlineOp'>
            <a type='link' onClick={() => edit(record)}>编辑</a>
            <Divider type='vertical' />
            <a type='link' onClick={() => del(record)}>删除</a>
            <Divider type='vertical' />
            <Link to={`/org/${params.orgId}/project/${record.id}/setting`}>设置</Link>
            <Divider type='vertical' />
            <Link to={`/org/${params.orgId}/project/${record.id}/variable`}>变量</Link>
          </span>
        );
      }
    }
  ];

  useEffect(() => {
    fetchList();
  }, [query]);

  const edit = () => {
    setOpt('edit');
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
        orgId: routesParams.curOrg.id
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
    }
    setVisible(!visible);
  };
  const operation = async ({ doWhat, payload }, cb) => {
    try {
      const method = {
        add: (param) => orgsAPI.resAccountCreate(param),
        del: ({ orgId, id }) => orgsAPI.resAccountDel({ orgId, id }),
        edit: (param) => orgsAPI.resAccountUpdate(param)
      };
      const res = await method[doWhat]({
        orgId: 3,
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
  return <Layout
    extraHeader={<PageHeader
      title='项目'
      breadcrumb={true}
      subDes={
        <Button onClick={() => {
          setOpt('add');
          toggleVisible();
        }}
        >创建项目</Button>
      }
    />}
  >
    <div className='container-inner-width'>
      <div className={styles.ct}>
        <div className='searchPanel'>
          <Input.Search
            placeholder='请输入项目名称搜索'
            style={{ width: 240 }}
            onSearch={v => changeQuery({ name: v, pageNo: 1 })}
          />
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
    </div>
    {
      visible && <OpModal
        visible={visible}
        opt={opt}
        toggleVisible={toggleVisible}
        reload={fetchList}
        operation={operation}
      />
    }
    <div className='fn-h-24'></div>
  </Layout>;
};

export default Eb_WP()(Index);
