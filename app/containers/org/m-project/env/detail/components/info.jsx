import React, { memo, useState, useEffect } from 'react';
import { Card, Descriptions, Collapse, Tag, Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import { ENV_STATUS, AUTO_DESTROY, ENV_STATUS_COLOR } from 'constants/types';
import { Eb_WP } from 'components/error-boundary';
import { timeUtils } from "utils/time";
import moment from 'moment';
import styles from '../styles.less';

const Index = (props) => {

  const { info, taskInfo } = props;

  const [ now, setNow ] = useState(moment());

  useEffect(() => {
    const t = setInterval(() => {
      setNow(moment());
    }, 1000);
    return () => {
      clearInterval(t);
    };
  }, []);

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
  
  return (
    <Collapse expandIconPosition={'right'} forceRender={true}>
      <Collapse.Panel header='环境详情'>
        <Descriptions 
          labelStyle={{ width: 105, textAlign: 'right', display: 'block' }}
        >
          <Descriptions.Item label='云模板'>{info.templateName || '-'}</Descriptions.Item>
          <Descriptions.Item label='分支'>{info.revision || '-'}</Descriptions.Item>
          <Descriptions.Item label='Commit_ID'><span onClick={() => {
            window.open(`${taskInfo.repoAddr.replace('.git', '')}/commit/${taskInfo.commitId}`); 
          }} className={styles.linkToCommit}
          >{taskInfo.commitId && taskInfo.commitId.substring(0, 12) || '-'}</span></Descriptions.Item>
          <Descriptions.Item label='资源数'>{info.resourceCount}</Descriptions.Item>
          <Descriptions.Item label='存活时间'>{formatTTL(info)}</Descriptions.Item>
          <Descriptions.Item label='target'>{info.target || '-'}</Descriptions.Item>
          <Descriptions.Item label='tfvars文件'>{info.tfVarsFile || '-'}</Descriptions.Item>
          <Descriptions.Item label='playbook文件'>{info.playbook || '-'}</Descriptions.Item>
          <Descriptions.Item label='部署通道'>{info.runnerId || '-'}</Descriptions.Item>
          <Descriptions.Item label='密钥'>{info.keyName || '-'}</Descriptions.Item>
          <Descriptions.Item label='更新时间'>{timeUtils.format(info.updatedAt) || '-'}</Descriptions.Item>
          <Descriptions.Item label='创建人'>{info.creator || '-'}</Descriptions.Item>
        </Descriptions>
      </Collapse.Panel>
    </Collapse>
  );
};

export default Eb_WP()(memo(Index));
