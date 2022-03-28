import React, { useState } from 'react';
import { Pagination, Checkbox, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import classNames from 'classnames';
import orgsAPI from 'services/orgs';
import envAPI from 'services/env';
import styles from './styles.less';
import ResourceItem from './component/resource_item';

const reqParams = {
  pageSize: 10
};

export default ({ match }) => {

  const { orgId } = match.params || {};

  // 列表查询
  const {
    loading: tableLoading,
    data: resourcesList = {},
    run: getResourcesList
  } = useRequest(
    (params) => requestWrapper(
      orgsAPI.listResources.bind(null, { orgId, ...params })
    ), {
      throttleInterval: 1000, // 节流
      defaultParams: [reqParams],
      // manual: true,
      onSuccess: () => {
        console.log(resourcesList);
      }
    }
  );

  //获取环境和provider列表
  const {
    data: providerAndEnvlist = {},
    run: getProvidersAndEnvs
  } = useRequest(
    (params) => requestWrapper(
      orgsAPI.filters.bind(null, { orgId })
    ), {
      throttleInterval: 1000, // 节流
      // manual: true，
      formatResult: (data) => {
        let tempData = {};
        tempData.envs = (data || {}).envs.map((val) => {
          return { label: val.envName, value: val.envId };
        });
        tempData.providers = (data || {}).Providers.map((val) => {
          return { label: "aliclound", value: val };
        });
        return tempData;
      },
      onSuccess: () => {
        console.log(providerAndEnvlist);
      }
    }
  );


  const {
    loading,
    data,
    run,
    mutate
  } = useRequest(
    () => requestWrapper(
      envAPI.getResources.bind(null, { envId: "env-c8acft3n6m8da397gnrg", orgId: "org-c8a738rn6m8fge3vg06g", projectId: "p-c8a73obn6m8fv9d3p1g0", resourceId: "r-c8ack1jn6m8da397gou0" })
    ), {
      // manual: true
    }
  );

  return (
    <Layout
      extraHeader={
        <PageHeader
          title={
            <div className={styles.search}>
              <span style={{ fontSize: "20px" }}>资源查询</span>
              <Input
                allowClear={true}
                style={{ width: "400px", marginLeft: "135px", height: "32px" }}
                placeholder='请输入关键字搜索'
                prefix={<SearchOutlined />}
                onChange={(e) => {
                  reqParams.q = e.target.value || '';
                  getResourcesList(reqParams); 
                }}
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
              options={providerAndEnvlist.envs}
              onChange={(v) => {
                reqParams.envIds = v.length > 0 ? v : undefined;
                getResourcesList(reqParams); 
              }}
            >
            </Checkbox.Group>
          </div>
          <div className={styles.provider_list}>
            <span>Provider</span>
            <Checkbox.Group 
              className={styles.checbox}
              style={{ width: '100%' }} 
              options={providerAndEnvlist.providers}
              onChange={(v) => {
                reqParams.providers = v.length > 0 ? v : undefined;
                getResourcesList(reqParams); 
              }}
            >
            </Checkbox.Group>
          </div>
        </div>
        <div className={styles.right}>
          {resourcesList.list ? resourcesList.list.map((val) => {
            return <ResourceItem {...val} />;
          }) : null}
          <div className={styles.pagination}>
            { resourcesList.list ? 
              <Pagination 
                defaultCurrent={1} 
                defaultPageSize={resourcesList.pageSize} 
                total={resourcesList.total} 
                onChange={(page, pageSize) => {
                  reqParams.currentPage = page;
                  reqParams.pageSize = pageSize;
                  getResourcesList(reqParams); 
                }}
              /> : null
            }
          </div>
        </div>
      </div>
    </Layout>
  );
};
