import React, { memo } from 'react';
import { Empty, Spin, Pagination } from 'antd';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { Eb_WP } from 'components/error-boundary';
import envAPI from 'services/env';
import { t } from 'utils/i18n';
import styles from './styles.less';
import EnvCard from '../env-card';

const EnvList = props => {
  const { match, panel, query, changeQuery } = props;
  const {
    params: { orgId, projectId },
  } = match;
  const {
    data: resultMap = {
      list: [],
      total: 0,
    },
    loading,
  } = useRequest(
    () =>
      requestWrapper(
        envAPI.envsList.bind(
          null,
          panel === 'running'
            ? {
                deploying: true,
                status: panel,
                orgId,
                projectId,
                ...query,
              }
            : {
                status: panel,
                orgId,
                projectId,
                ...query,
              },
        ),
      ),
    {
      refreshDeps: [query],
    },
  );

  return (
    <>
      <Spin spinning={loading}>
        {resultMap.list.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          resultMap.list.map(data => <EnvCard data={data} match={match} />)
        )}
      </Spin>
      <div className={styles.pagination}>
        <Pagination
          size='default'
          total={resultMap.total}
          hideOnSinglePage={true}
          pageSize={query.pageSize}
          current={query.currentPage}
          onChange={(currentPage, pageSize) => {
            changeQuery({
              currentPage,
              pageSize,
            });
          }}
          showTotal={total =>
            t('define.pagination.showTotal', { values: { total } })
          }
        />
      </div>
    </>
  );
};

export default Eb_WP()(memo(EnvList));
