import React, { useState, useEffect, useMemo } from 'react';
import { notification } from "antd";
import history from 'utils/history';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { t } from 'utils/i18n';
import { Eb_WP } from 'components/error-boundary';
import Layout from "components/common/layout";
import PageHeader from "components/pageHeader";
import classNames from 'classnames';
import styles from './index.less';
import PackCard from '../components/pack-card';
import PackDetail from '../components/pack-detail';
import packAPI from 'services/pack';
export default ({ match = {} }) => {
  const pageSize = 24;
  const [ current, setCurrent ] = useState(1);
  const [ visible, setVisible ] = useState(false);
  const [ detail, setDetail ] = useState({});
  const [ searchKeyword, setSearchKeyword ] = useState('');
  const { orgId } = match.params || {};
  const [ packId, setPackId ] = useState('');
  const { 
    data: {
      list = [],
      total = 0
    } = {}
  } = useRequest(
    () => requestWrapper(
      packAPI.list.bind(null, { 
        pageSize, 
        page: current
      }),
      {
        errorJudgeFn: (res) => (res.code === 404 || res.code === 500)
      }
    ),
    {
      formatResult: data => data,
      refreshDeps: [ searchKeyword, current ]
    }
  );

  const getDetail = async (id) => {
    const res = await packAPI.detail(id);
    if (res.code !== 0) {
      return notification.error({ message: res.message });
    }
    setDetail(res.result || {});
  };

  const toggleVisible = (packId) => {
    if (!visible) {
      getDetail(packId);
    }
    setVisible(!visible);
  };


  return (
    <Layout
      extraHeader={<PageHeader title={t('define.import.fromExchange')} breadcrumb={true} />}
    >
      <div className={classNames('idcos-card', styles.exchange_list)}>
        {
          list.map((item) => (
            <PackCard 
              data={item}
              toggleVisible={toggleVisible}
            />
          ))
        }
      </div>
      <PackDetail 
        detail={detail} 
        visible={visible}
        toggleVisible={toggleVisible}
        orgId={orgId}
      />
    </Layout>
  );
};



