import React, { useState, useEffect, memo } from 'react';
import { Card, Space, Radio, Input, notification, Divider, Menu } from 'antd';
import history from 'utils/history';
import { Link } from 'react-router-dom';
import moment from 'moment';
import styles from '../styles.less';
import { ENV_STATUS, AUTO_DESTROY } from 'constants/types';

import { Eb_WP } from 'components/error-boundary';

import { envAPI, orgsAPI } from 'services/base';

const Index = (props) => {
  const { match, panel, routesParams: { curProject } } = props,
    { params: { orgId, projectId } } = match;

  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [],
      total: 0
    }),
    [ query, setQuery ] = useState({
      status: panel
    });

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

  const changeQuery = (payload) => {
    setQuery({
      ...query,
      ...payload
    });
  };
  const getTTL = (info) => {
    let str = '-';
    if (!!info.autoDestroyAt) {
      str = moment(info.autoDestroyAt).format('YYYY-MM-DD HH:mm');
    } else if ((info.ttl === '' || info.ttl === null || info.ttl === '0') && !info.autoDestroyAt) {
      str = '无限';
    } else if (!info.autoDestroyAt) {
      str = ((AUTO_DESTROY.filter(d => d.code === info.ttl)[0] || {}).name) || '无限';
    }
    return str;
  };
  return <div>
    {resultMap.list.map(d => <Card style={{ marginTop: 20 }} type='inner' title={<a onClick={() => {
      history.push(`/org/${orgId}/project/${projectId}/m-project-env/detail/${d.id}/resource`); 
    }}
    >{d.name || '-'}</a>}
    >
      <div className={styles.envlistBox} style={{ }}>
        <div>TTL:{getTTL(d)}</div>
        <div><Divider type='vertical' />云模版:{d.templateName || '-'}</div>
        <div><Divider type='vertical' />资源数:{d.resourceCount || '-'}</div>
        <div><Divider type='vertical' />创建人: {d.creator || '-'}</div>
        <div><Divider type='vertical' />状态:{ENV_STATUS[d.status] || '-'}</div>
      </div>
    </Card>)}
  </div>;
};

export default Eb_WP()(memo(Index));
