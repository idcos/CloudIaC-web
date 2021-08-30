import React, { useState, useEffect, memo } from 'react';
import { Card, notification, Divider, Tag, Space } from 'antd';
import moment from 'moment';

import history from 'utils/history';
import { ENV_STATUS, AUTO_DESTROY, ENV_STATUS_COLOR } from 'constants/types';
import { timeUtils } from "utils/time";
import { Eb_WP } from 'components/error-boundary';
import envAPI from 'services/env';

import styles from '../styles.less';

const Index = (props) => {
  const { match, panel, routesParams: { curProject } } = props,
    { params: { orgId, projectId } } = match;


  const [ loading, setLoading ] = useState(false),
    [ now, setNow ] = useState(moment()),
    [ resultMap, setResultMap ] = useState({
      list: [],
      total: 0
    }),
    [ query, setQuery ] = useState({
      status: panel
    });

  useEffect(() => {
    const t = setInterval(() => {
      setNow(moment());
    }, 1000);
    return () => {
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    fetchList();
  }, [query]);
  const fetchList = async () => {
    try {
      setLoading(true);
      const { combinedStatus } = query;
      const res = await envAPI.envsList({
        status: panel,
        orgId,
        projectId
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

  const formatTTL = ({ autoDestroyAt, ttl }) => {
    if (autoDestroyAt) {
      return timeUtils.diff(autoDestroyAt, now, '-');
    }
    switch (ttl) {
    case '':
    case null:
    case undefined:
      return '-';
    case 0:
    case '0':
      return '不限制';
    default:
      const it = AUTO_DESTROY.find(d => d.code === ttl) || {};
      return it.name;
    }
  };

  return <div>
    {
      resultMap.list.map(d => 
        <Card 
          style={{ marginTop: 20 }} 
          type='inner' 
          title={(
            <Space>
              <a onClick={() => {
                history.push(`/org/${orgId}/project/${projectId}/m-project-env/detail/${d.id}/resource`); 
              }}
              >{d.name || '-'}</a>
              <span style={{ color: 'rgba(0, 0, 0, 0.26)', fontSize: 12 }}>ID：{d.id}</span>
            </Space>
          )}
        >
          <Space split={<Divider type='vertical' />}className={styles.envlistBox}>
            <div className={styles.excelps}>存活时间：{formatTTL(d)}</div>
            <div className={styles.excelps}>云模板：{d.templateName || '-'}</div>
            <div>资源数：{d.resourceCount || '-'}</div>
            <div>创建人：{d.creator || '-'}</div>
            <div style={{ display: 'flex' }}>状态：{ENV_STATUS[d.status] && <Tag color={ENV_STATUS_COLOR[d.status] || 'default'}>{ENV_STATUS[d.status]}</Tag> || '-'}</div>
          </Space>
        </Card>
      )
    }
  </div>;
};

export default Eb_WP()(memo(Index));
