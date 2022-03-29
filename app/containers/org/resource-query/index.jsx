import React, { useState } from 'react';
import { Pagination, Checkbox, Input, Empty, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import classNames from 'classnames';
import orgsAPI from 'services/orgs';
import styles from './styles.less';
import ResourceItem from './component/resource_item';
import Item from 'antd/lib/list/Item';

export default ({ match }) => {

  const { orgId } = match.params || {};
  const [ page, setPage ] = useState({ currentPage: 1, pageSize: 10 });
  const [ searchParams, setSearchParams ] = useState({});
  const [ searchCount, setSearchCount ] = useState(1);

  // 列表查询
  const {
    loading: tableLoading,
    data: resources = {
      list: [],
      total: 0,
      pageSize: 10
    }
  } = useRequest(
    () => requestWrapper(
      orgsAPI.listResources.bind(null, { orgId, ...page, ...searchParams })
    ), {
      debounceInterval: 1000, // 防抖
      refreshDeps: [searchCount]
    }
  );

  //获取环境和provider列表
  const {
    data: {
      envs = [],
      providers = []
    } = {}
  } = useRequest(
    () => requestWrapper(
      orgsAPI.filters.bind(null, { orgId })
    ), {
      formatResult: (data) => {
        const { envs, Providers } = data || {};
        return {
          envs: (envs || []).map((val) => ({ label: val.envName, value: val.envId })),
          providers: (Providers || []).map((val) => ({ label: val, value: val }))
        };
      }
    }
  );

  const onParamsSearch = (params) => {
    setSearchParams(preValue => ({ ...preValue, ...params }));
    setPage(preValue => ({ ...preValue, currentPage: 1 }));
    setSearchCount(preValue => preValue + 1);
  };

  const onPageSearch = (currentPage, pageSize) => {
    setPage({ currentPage, pageSize });
    setSearchCount(preValue => preValue + 1);
  };

  return (
    <Layout
      extraHeader={
        <PageHeader
          title={
            <div className={styles.search}>
              <span style={{ fontSize: 20 }}>资源查询</span>
              <Input
                allowClear={true}
                style={{ width: 400, marginLeft: 135, height: 32 }}
                placeholder='请输入关键字搜索'
                prefix={<SearchOutlined />}
                onPressEnter={(e) => onParamsSearch({ q: e.target.value })}
              />
            </div>}
          breadcrumb={true}
        />
      }
    >
      <div className={classNames(styles.res_query, 'idcos-card')}>
        <div className={styles.left}>
          <div className={styles.env_list}>
            <span>环境</span>
            <Checkbox.Group 
              className={styles.checbox}
              style={{ width: '100%' }} 
              onChange={(v) => onParamsSearch({ envIds: v.length > 0 ? v : undefined })}  
            >
              {envs.map((item) => {
                return <span title={item.label}><Checkbox value={item.value}>{item.label}</Checkbox></span>;
              })}
            </Checkbox.Group>
          </div>
          <div className={styles.provider_list}>
            <span>Provider</span>
            <Checkbox.Group 
              className={styles.checbox}
              style={{ width: '100%' }} 
              onChange={(v) => onParamsSearch({ providers: v.length > 0 ? v : undefined })}  
            >
              {providers.map((item) => {
                return <span title={item.label}><Checkbox value={item.value}>{item.label}</Checkbox></span>;
              })}
            </Checkbox.Group>
          </div>
        </div>
        <div className={styles.right}>
          {tableLoading ? <Spin className='spinning' spinning={true} /> : (
            resources.list.length ? (
              resources.list.map((val) => {
                return <ResourceItem {...val} />;
              })
            ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
          <div className={styles.pagination}>
            <Pagination 
              size='default'
              total={resources.total} 
              hideOnSinglePage={true}
              pageSize={page.pageSize}
              current={page.currentPage}
              onChange={onPageSearch}
              showTotal={(total) => `共${total}条`}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};
