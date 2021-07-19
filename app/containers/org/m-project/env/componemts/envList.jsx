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
  return <div>
    {resultMap.list.map(d => <Card style={{ marginTop: 20 }} type='inner' title={<a onClick={() => {
      history.push(`/org/${orgId}/project/${projectId}/m-project-env/detail/${d.id}`); 
    }}
    >{d.name || '-'}</a>}
    >
      <div className={styles.envlistBox} style={{ }}>
        <div>TTL:{(((AUTO_DESTROY.filter(d => d.code === d.ttl)[0] || {}).name)) || (d.ttl == 0 ? '无限' : '-')}</div>
        <div><Divider type='vertical' />云模版:{d.templateName || '-a aaaaaaaaaaaaaaaaaaaaalmfkenfksengksjgnskjgnskjegnskjengkesjngsekjgnseknjkensgkjsengksnkj'}</div>
        <div><Divider type='vertical' />资源数:{d.resourceCount || '-'}</div>
        <div><Divider type='vertical' />创建人: {d.creator || '-'}</div>
        <div><Divider type='vertical' />状态:{ENV_STATUS[d.status] || '-'}</div>
      </div>
    </Card>)}
  </div>;
};

export default Eb_WP()(memo(Index));
