import React, { useState, useEffect, memo } from 'react';
import { Card, Space, Radio, Input, notification, Descriptions, Menu } from 'antd';
import history from 'utils/history';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Eb_WP } from 'components/error-boundary';

import { pjtAPI, orgsAPI } from 'services/base';

const Index = (props) => {
  const { match, panel, routes } = props,
    { params: { orgId } } = match;
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
  }, []);

  const fetchList = async () => {
    try {
      setLoading(true);
      const { combinedStatus } = query;
      const res = await pjtAPI.projectList({
        statu: panel,
        orgId: orgId
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
  return <Card headStyle={{ backgroundColor: '#E3EBEB' }} type={'inner'} title={'环境详情'}>
    <Descriptions 
      labelStyle={{ width: 100, textAlign: 'right', display: 'block' }}
    >
      <Descriptions.Item label='状态'>Zhou Maomao</Descriptions.Item>
      <Descriptions.Item label='云模版'>1810000000</Descriptions.Item>
      <Descriptions.Item label='分支'>Hangzhou, Zhejiang</Descriptions.Item>
      <Descriptions.Item label='Commit_ID'>empty</Descriptions.Item>
      <Descriptions.Item label='资源数'>empty</Descriptions.Item>
      <Descriptions.Item label='TTL'>empty</Descriptions.Item>
      <Descriptions.Item label='密钥'>密钥</Descriptions.Item>
      <Descriptions.Item label='更新时间'>更新时间</Descriptions.Item>
      <Descriptions.Item label='执行人'>执行人</Descriptions.Item>
    </Descriptions>
  </Card>;
};

export default Eb_WP()(memo(Index));
