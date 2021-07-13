import React, { useState, useEffect } from 'react';
import { Button, Table, Radio, Input, notification, Divider, Menu } from 'antd';
import history from 'utils/history';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Eb_WP } from 'components/error-boundary';
import PageHeaderPlus from 'components/pageHeaderPlus';
import LayoutPlus from 'components/common/layout/plus';
import styles from './styles.less';

import { pjtAPI, orgsAPI } from 'services/base';

const CTList = ({ match = {} }) => {
  const { orgId } = match.params || {};
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
      pageSize: 10
    });

  const columns = [
    {
      dataIndex: 'name',
      title: '云模版名称'
    },
    {
      dataIndex: 'description',
      title: '云模版描述'
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
      title: '操作',
      width: 180,
      render: (_, record) => {
        return (
          <span className='inlineOp'>
            <a type='link' >编辑</a>
            <Divider type='vertical' />
            <a type='link' >删除</a>
          </span>
        );
      }
    }
  ];

  useEffect(() => {
    fetchList();
  }, [query]);

  const fetchList = () => {
    // console.log('fetchList');
  };

  const changeQuery = (payload) => {
    setQuery({
      ...query,
      ...payload
    });
  };

  const createCT = () => {
    history.push(`/org/${orgId}/m-org-ct/createCT`);
  };

  return <LayoutPlus
    extraHeader={<PageHeaderPlus
      title='云模版'
      breadcrumb={true}
    />}
  >
    <div className='idcos-card'>
      <div className={styles.ct}>
        <div style={{ marginBottom: 20 }}>
          <Button 
            type='primary'
            onClick={createCT}
          >新建云模版</Button>
        </div>
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
      </div>
    </div>
  </LayoutPlus>;
};

export default Eb_WP()(CTList);
