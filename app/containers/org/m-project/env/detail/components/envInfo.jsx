import React, { memo, useState, useEffect } from 'react';
import { Descriptions, Collapse } from 'antd';
import { AUTO_DESTROY } from 'constants/types';
import { Eb_WP } from 'components/error-boundary';
import { timeUtils } from "utils/time";
import moment from 'moment';
import styles from '../styles.less';

const EnvInfo = (props) => {

  const { envInfo, taskInfo } = props;

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
          <Descriptions.Item label='云模板'>{envInfo.templateName || '-'}</Descriptions.Item>
          <Descriptions.Item label='分支'>{envInfo.revision || '-'}</Descriptions.Item>
          <Descriptions.Item label='Commit_ID'><span onClick={() => {
            window.open(`${taskInfo.repoAddr.replace('.git', '')}/commit/${taskInfo.commitId}`); 
          }} className={styles.linkToCommit}
          >{taskInfo.commitId && taskInfo.commitId.substring(0, 12) || '-'}</span></Descriptions.Item>
          <Descriptions.Item label='资源数'>{envInfo.resourceCount}</Descriptions.Item>
          <Descriptions.Item label='存活时间'>{formatTTL(envInfo)}</Descriptions.Item>
          <Descriptions.Item label='target'>{envInfo.target || '-'}</Descriptions.Item>
          <Descriptions.Item label='tfvars文件'>{envInfo.tfVarsFile || '-'}</Descriptions.Item>
          <Descriptions.Item label='playbook文件'>{envInfo.playbook || '-'}</Descriptions.Item>
          <Descriptions.Item label='部署通道'>{envInfo.runnerId || '-'}</Descriptions.Item>
          <Descriptions.Item label='密钥'>{envInfo.keyName || '-'}</Descriptions.Item>
          <Descriptions.Item label='更新时间'>{timeUtils.format(envInfo.updatedAt) || '-'}</Descriptions.Item>
          <Descriptions.Item label='创建人'>{envInfo.creator || '-'}</Descriptions.Item>
        </Descriptions>
      </Collapse.Panel>
    </Collapse>
  );
};

export default Eb_WP()(memo(EnvInfo));
