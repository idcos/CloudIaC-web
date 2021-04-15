import React, { useState, useEffect } from 'react';
import { Button, Table, Radio, Input, notification } from 'antd';
import history from 'utils/history';
import { Link } from 'react-router-dom';
import moment from 'moment';

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';
import styles from './styles.less';

import { ctAPI } from 'services/base';
import { CT } from 'constants/types';
import { statusTextCls } from 'utils/util';

const CloudTmp = (props) => {
  const { match, routesParams } = props,
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
  const tableFilterFieldName = 'taskStatus';

  const columns = [
    {
      dataIndex: 'name',
      title: '云模板名称',
      render: (text, record) => <Link to={`/org/${params.orgId}/ct/detailCT/${record.id}`}>{text}</Link>
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
      dataIndex: 'taskGuid',
      title: '最后运行作业'
    },
    {
      dataIndex: 'repoAddr',
      title: '仓库地址'
    },
    {
      dataIndex: 'taskUpdatedAt',
      title: '更新时间',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
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

  return <Layout
    extraHeader={<PageHeader
      title='云模板'
      breadcrumb={true}
      subDes={<Button onClick={() => history.push(`/org/${params.orgId}/ct/createCT`)}>创建云模板</Button>}
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
            {Object.keys(CT.taskStatus).map(it => <Radio.Button value={it}>{CT.taskStatusIcon[it]} {CT.taskStatus[it]}</Radio.Button>)}
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
