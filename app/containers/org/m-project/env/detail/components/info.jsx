import React, { memo } from 'react';
import { Card, Descriptions } from 'antd';
import moment from 'moment';

import { ENV_STATUS } from 'constants/types';
import { Eb_WP } from 'components/error-boundary';
import { AUTO_DESTROY } from 'constants/types';
import { timeUtils } from "utils/time";

const Index = (props) => {
  const { info = {} } = props;
  const getTTL = () => {
    let str = '-';
    if (!!info.autoDestroyAt) {
      str = timeUtils.format(info.autoDestroyAt) || '-';
    } else if ((info.ttl === '' || info.ttl === null) && !info.autoDestroyAt) {
      str = '无限';
    } else if (!info.autoDestroyAt) {
      str = ((AUTO_DESTROY.filter(d => d.code === info.ttl)[0] || {}).name) || '无限';
    }
    return str;
  };
  // const getTTL = () => {
  //   const prefixInteger = (num, n) => {
  //     return (Array(n).join(0) + num).slice(-n);
  //   }
  //   const du = moment.duration(moment(info.autoDestroyAt).diff(moment()), 'ms');
  //   const h = du.get('hours');
  //   const m = du.get('minutes');
  //   const s = du.get('seconds');
  //   const diff = moment.preciseDiff(moment(info.autoDestroyAt), moment(), true)
  //   console.log(diff);
  //   if (h<=0 && m<=0 && s<=0) {
  //     return '00:00:00';
  //   } else {
  //     return prefixInteger(h, 2) + ':' + prefixInteger(m, 2) + ':' + prefixInteger(s, 2)
  //   }
  // };
  return <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={'环境详情'}>
    <Descriptions 
      labelStyle={{ width: 100, textAlign: 'right', display: 'block' }}
    >
      <Descriptions.Item label='状态'>{ENV_STATUS[info.status] || '-'}</Descriptions.Item>
      <Descriptions.Item label='云模版'>{info.templateName || '-'}</Descriptions.Item>
      <Descriptions.Item label='分支'>{info.revision || '-'}</Descriptions.Item>
      {/* <Descriptions.Item label='Commit_ID'>empty</Descriptions.Item> */}
      <Descriptions.Item label='资源数'>{info.resourceCount || '-'}</Descriptions.Item>
      <Descriptions.Item label='TTL'>{getTTL()}</Descriptions.Item>
      <Descriptions.Item label='密钥'>{info.keyName || '-'}</Descriptions.Item>
      <Descriptions.Item label='更新时间'>{timeUtils.format(info.updatedAt) || '-'}</Descriptions.Item>
      <Descriptions.Item label='执行人'>{info.creator || '-'}</Descriptions.Item>
    </Descriptions>
  </Card>;
};

export default Eb_WP()(memo(Index));
