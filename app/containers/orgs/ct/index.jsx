import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, Radio, Input, notification } from 'antd';

import history from 'utils/history';
import { Link } from 'react-router-dom';

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';

import { AppstoreFilled, CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled, ClockCircleFilled } from '@ant-design/icons';

import styles from './styles.less';

import { ctAPI } from "../../../services/base";

const CT_STATUS = {
  all: '全部',
  success: '成功',
  error: '错误',
  queue: '排队',
  running: '运行中'
};

const CT_STATUS_ICON = {
  all: <AppstoreFilled/>,
  success: <CheckCircleFilled/>,
  error: <CloseCircleFilled/>,
  queue: <ExclamationCircleFilled/>,
  running: <ClockCircleFilled/>
};

const CloudTmp = (props) => {
  const { match } = props,
    { params } = match;
  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [{ name: 1, id: 1 }],
      total: 0
    }),
    [ query, setQuery ] = useState({
      pageNo: 1,
      pageSize: 10,
      status: 'all'
    });
  const tableFilterFieldName = 'status';

  const columns = [
    {
      dataIndex: 'name',
      title: '云模板名称',
      render: (text, record) => <Link to={`/${params.orgId}/ct/detailCT/${record.id}`}>{text}</Link>
    },
    {
      dataIndex: tableFilterFieldName,
      title: '最后运行状态',
      filters: query.status == 'all' && Object.keys(CT_STATUS)
        .filter(it => it !== 'all')
        .map(it => ({ text: CT_STATUS[it], value: it })),
      width: 150
    },
    {
      dataIndex: '3',
      title: '最后运行作业'
    },
    {
      dataIndex: '4',
      title: '仓库地址'
    },
    {
      dataIndex: '5',
      title: '更新时间'
    }
  ];

  useEffect(() => {
    fetchList();
  }, [query]);


  const fetchList = async () => {
    try {
      setLoading(true);
      const { combinedStatus, status, ...restQuery } = query;
      const res = await ctAPI.list({
        ...restQuery,
        status: combinedStatus || status
      });
      if (res.isSuccess) {
        setResultMap({
          list: res.resultObject.pageElements || [],
          total: res.resultObject.total || 0
        });
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      notification.error({
        message: '获取失败',
        description: e + ''
      });
    }
  };

  const changeQuery = (payload) => {
    setQuery({
      ...query,
      ...payload
    });
  };

  return <Layout
    extraHeader={<PageHeader
      title='云模板'
      breadcrumb={true}
      subDes={<Button onClick={() => history.push(`/${params.orgId}/ct/createCT`)}>创建云模板</Button>}
    />}
  >
    <div className='container-inner-width'>
      <div className={styles.ct}>
        <div className='searchPanel'>
          <Radio.Group
            onChange={(e) =>
              changeQuery({
                status: e.target.value,
                combinedStatus: undefined,
                pageNo: 1
              })
            }
            value={query.status}
          >
            {Object.keys(CT_STATUS).map(it => <Radio.Button value={it}>{CT_STATUS_ICON[it]} {CT_STATUS[it]}</Radio.Button>)}
          </Radio.Group>
          <Input.Search
            placeholder='请输入云模板名称搜索'
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
  </Layout>;
};

export default Eb_WP()(CloudTmp);
