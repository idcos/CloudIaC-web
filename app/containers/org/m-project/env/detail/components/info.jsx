import React, { memo, useState, useEffect, useRef } from 'react';
import { Card, Descriptions, notification } from 'antd';

import { ENV_STATUS } from 'constants/types';
import { Eb_WP } from 'components/error-boundary';
import { timeUtils } from "utils/time";
import { END_ENV_STATUS_LIST } from "constants/types";
import { envAPI } from 'services/base';
import moment from 'moment';

const Index = (props) => {

  const { match: { params: { orgId, projectId, envId } } } = props;

  const [ info, setInfo ] = useState({});
  const [ now, setNow ] = useState(moment());

  const endRef = useRef();

  useEffect(() => {
    fetchInfo();
    const t = setInterval(() => {
      setNow(moment());
    }, 1000);
    return () => {
      endRef.current = true;
      clearInterval(t);
    };
  }, []);

  // 获取Info
  const fetchInfo = async ({ isLoop } = {}) => {
    try {
      const res = await envAPI.envsInfo({
        orgId, projectId, envId
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      const data = res.result || {};
      if (!isLoop) {
        setInfo(data);
      } else {
        setInfo(preInfo => {
          return data.status !== preInfo.status ? data : preInfo;
        });
      }
      // 循环刷新详情数据
      if (END_ENV_STATUS_LIST.indexOf(data.status) === -1 && !endRef.current) {
        setTimeout(() => {
          fetchInfo({ isLoop: true });
        }, 1500);
      }
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const formatTTL = ({ autoDestroyAt, ttl }) => {
    if (ttl == '0') {
      return '不限';
    }
    return timeUtils.diff(autoDestroyAt, now);
  };
  
  return <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={'环境详情'}>
    <Descriptions 
      labelStyle={{ width: 100, textAlign: 'right', display: 'block' }}
    >
      <Descriptions.Item label='状态'>{ENV_STATUS[info.status] || '-'}</Descriptions.Item>
      <Descriptions.Item label='云模版'>{info.templateName || '-'}</Descriptions.Item>
      <Descriptions.Item label='分支'>{info.revision || '-'}</Descriptions.Item>
      <Descriptions.Item label='资源数'>{info.resourceCount || '-'}</Descriptions.Item>
      <Descriptions.Item label='存活时间'>{formatTTL(info)}</Descriptions.Item>
      <Descriptions.Item label='密钥'>{info.keyName || '-'}</Descriptions.Item>
      <Descriptions.Item label='更新时间'>{timeUtils.format(info.updatedAt) || '-'}</Descriptions.Item>
      <Descriptions.Item label='执行人'>{info.creator || '-'}</Descriptions.Item>
    </Descriptions>
  </Card>;
};

export default Eb_WP()(memo(Index));
