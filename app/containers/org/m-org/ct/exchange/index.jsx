import React, { useState, useEffect, useMemo } from 'react';
import { Button, Table, notification, Space, Popconfirm, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
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
export default ({ match = {} }) => {
  
  return (
    <Layout
      extraHeader={<PageHeader title={t('define.import.fromExchange')} breadcrumb={true} />}
    >
      <div className={classNames('idcos-card', styles.exchange_list)}>

      </div>
    </Layout>
  );
};