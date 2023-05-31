import React, { useState } from 'react';
import { Pagination, Checkbox, Input, Empty, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import classNames from 'classnames';
import orgsAPI from 'services/orgs';
import styles from './styles.less';
import ResourceItem from './component/resource_item';
import { t } from 'utils/i18n';

const ResourceQuery = ({ match }) => {
  const { orgId } = match.params || {};
  const [page, setPage] = useState({ currentPage: 1, pageSize: 10 });
  const [searchParams, setSearchParams] = useState({});
  const [searchCount, setSearchCount] = useState(1);

  // 列表查询
  const {
    loading: tableLoading,
    data: resources = {
      list: [],
      total: 0,
      pageSize: 10,
    },
  } = useRequest(
    () =>
      requestWrapper(
        orgsAPI.listResources.bind(null, { orgId, ...page, ...searchParams }),
      ),
    {
      debounceInterval: 1000, // 防抖
      refreshDeps: [searchCount],
    },
  );

  //获取环境和provider列表
  const { data: { projects = [], providers = [] } = {} } = useRequest(
    () => requestWrapper(orgsAPI.filters.bind(null, { orgId })),
    {
      formatResult: data => {
        const { projects, providers } = data || {};
        return {
          projects: (projects || []).map(val => ({
            label: val.projectName,
            value: val.projectId,
          })),
          providers: (providers || []).map(val => ({ label: val, value: val })),
        };
      },
    },
  );

  const onParamsSearch = params => {
    setSearchParams(preValue => ({ ...preValue, ...params }));
    setPage(preValue => ({ ...preValue, currentPage: 1 }));
    setSearchCount(preValue => preValue + 1);
  };

  const onPageSearch = (currentPage, pageSize) => {
    setPage({ currentPage, pageSize });
    setSearchCount(preValue => preValue + 1);
  };

  return (
    <div style={{ padding: 24 }}>
      <div className={classNames(styles.res_query)}>
        <div className={styles.left}>
          <div className={styles.env_list}>
            <span>{t('define.scope.project')}</span>
            <Checkbox.Group
              className={styles.checbox}
              style={{ width: '100%' }}
              onChange={v =>
                onParamsSearch({ projectIds: v.length > 0 ? v : undefined })
              }
            >
              {projects.map(item => {
                return (
                  <span title={item.label}>
                    <Checkbox value={item.value}>{item.label}</Checkbox>
                  </span>
                );
              })}
            </Checkbox.Group>
          </div>
          <div className={styles.provider_list}>
            <span>Provider</span>
            <Checkbox.Group
              className={styles.checbox}
              style={{ width: '100%' }}
              onChange={v =>
                onParamsSearch({ providers: v.length > 0 ? v : undefined })
              }
            >
              {providers.map(item => {
                return (
                  <span title={item.label}>
                    <Checkbox value={item.value}>{item.label}</Checkbox>
                  </span>
                );
              })}
            </Checkbox.Group>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.search}>
            <Input
              allowClear={true}
              style={{ width: 400 }}
              placeholder={t('define.form.input.search.placeholder.key')}
              prefix={<SearchOutlined />}
              onPressEnter={e => onParamsSearch({ q: e.target.value })}
            />
          </div>
          {tableLoading ? (
            <Spin className='spinning' spinning={true} />
          ) : resources.list.length ? (
            resources.list.map(val => {
              return <ResourceItem {...val} />;
            })
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
          <div className={styles.pagination}>
            <Pagination
              size='default'
              total={resources.total}
              hideOnSinglePage={true}
              pageSize={page.pageSize}
              current={page.currentPage}
              onChange={onPageSearch}
              showTotal={total =>
                t('define.pagination.showTotal', { values: { total } })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceQuery;
