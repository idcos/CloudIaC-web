import React, { useState, useEffect, memo } from 'react';
import { Card, Space, Radio, Input, notification, Divider, Menu } from 'antd';
import history from 'utils/history';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Eb_WP } from 'components/error-boundary';

import { pjtAPI, orgsAPI } from 'services/base';

const Index = (props) => {
  const { match, panel, routes } = props,
    { params } = match;
  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [1],
      total: 0
    }),
    [ query, setQuery ] = useState({
      pageNo: 1,
      pageSize: 10,
      status: panel
    });

  useEffect(() => {
    fetchList();
  }, [query]);

  const fetchList = async () => {
    try {
      setLoading(true);
      const { combinedStatus } = query;
      const res = await pjtAPI.projectList({
        statu: panel,
        orgId: params.orgId
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
    {resultMap.list.map(d => <Card style={{ marginTop: 20 }} type='inner' title={<a>环境名称</a>} >
      <Space style={{ display: 'flex', justifyContent: 'space-around' }} split={<Divider type='vertical' />}>
        <span style={{ width: '20%' }}>{props.panel}LinkLinkLinkLinkLink</span>
        <span style={{ width: '20%' }}>LinkLinkLink</span>
        <span style={{ width: '20%' }}>LinkLinkLinkLinkLinkLinkLinkLinkLinkLinkLinkLinkLinkLink</span>
        <span style={{ width: '20%' }}>Link</span>
        <span style={{ width: '20%' }}>LinkLinkLinkLinkLinkLink</span>
      </Space>
    </Card>)}
  </div>;
};

export default Eb_WP()(memo(Index));
