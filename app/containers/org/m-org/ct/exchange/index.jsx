import React, { useState, useEffect, useMemo } from 'react';
import { notification, Input, Pagination } from "antd";
import history from 'utils/history';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { SearchOutlined } from '@ant-design/icons';
import { t } from 'utils/i18n';
import { Eb_WP } from 'components/error-boundary';
import Layout from "components/common/layout";
import PageHeader from "components/pageHeader";
import classNames from 'classnames';
import styles from './index.less';
import StackCard from '../components/stack-card';
import StackDetail from '../components/stack-detail';
import stackAPI from 'services/stack';
export default ({ match = {} }) => {
  const pageSize = 24;
  const [ current, setCurrent ] = useState(1);
  const [ visible, setVisible ] = useState(false);
  const [ detail, setDetail ] = useState({});
  const [ searchKeyword, setSearchKeyword ] = useState('');
  const { orgId } = match.params || {};
  const [ stackId, setStackId ] = useState('');
  const [ versionList, setVersionList ] = useState([]);
  const [ readme, setReadme ] = useState('');
  const [ currentVersion, setCurrentVersion ] = useState();
  const [ query, setQuery ] = useState({});
  const { 
    data: {
      list = [],
      total = 0
    } = {}
  } = useRequest(
    () => requestWrapper(
      stackAPI.list.bind(null, { 
        pageSize, 
        page: current,
        q: query.q
      }),
      {
        errorJudgeFn: (res) => (res.code === 404 || res.code === 500)
      }
    ),
    {
      formatResult: data => data,
      refreshDeps: [ searchKeyword, current, query ]
    }
  );
  useEffect(() => {
    setCurrent(1);
  }, [query]);
 
  const getDetail = async (id) => {
    const res = await stackAPI.detail(id);
    if (res.code !== 0) {
      return notification.error({ message: res.message });
    }
    setDetail(res.result || {});
  };

  const toggleVisible = (packId) => {
    if (!visible) {
      setCurrentVersion(undefined);
      setReadme('');
      getDetail(packId);
      getVersionList(packId);
    }
    setVisible(!visible);
  };

  useEffect(() => {
    if (currentVersion === undefined && detail.latestVersionId) {
      setCurrentVersion(detail.latestVersion);
    }
  }, [detail]);

  useEffect(() => {
    if (currentVersion) {
      getReadme(detail.id, { version: currentVersion });
    }
  }, [ detail, currentVersion ]);

  const getVersionList = async (id) => {
    const res = await stackAPI.version(id);
    if (res.code !== 0) {
      return notification.error({ message: res.message });
    }
    setVersionList(res.result || []);
  };

  const getReadme = async (id, { version }) => {
    const res = await stackAPI.readme(id, { version });
    if (res.code !== 0) {
      return notification.error({ message: res.message });
    }
    const { content } = res.result || {};
    setReadme(content || '');
  };
  


  return (
    <Layout
      extraHeader={
        <PageHeader 
          title={t('define.import.fromExchange')} 
          breadcrumb={true}
          subDes={<Input
            style={{ width: 300 }}
            allowClear={true}
            placeholder={t('define.exchange.search.placeholder')}
            prefix={<SearchOutlined />}
            defaultValue={query.q}
            onPressEnter={(e) => {
              setQuery({ q: e.target.value });
            }}
          />}
        />
      }
    >
      <div className='idcos-card'>
        <div className={styles.exchange_list}>
          {
            list.map((item) => (
              <StackCard 
                data={item}
                toggleVisible={toggleVisible}
              />
            ))
          }
        </div>
        
        <Pagination 
          style={{ textAlign: 'right', marginTop: 24, position: 'relative' }}
          showSizeChanger={false}
          hideOnSinglePage={false}
          current={current} 
          pageSize={pageSize} 
          onChange={(page) => setCurrent(page)} 
          total={total}
          showTotal={(total) => t('define.pagination.showTotal', { values: { total } })}
        />
      </div>
      <StackDetail 
        detail={detail} 
        visible={visible}
        toggleVisible={toggleVisible}
        orgId={orgId}
        readme={readme}
        versionList={versionList}
        currentVersion={currentVersion}
        setCurrentVersion={setCurrentVersion}
      />
    </Layout>
  );
};



