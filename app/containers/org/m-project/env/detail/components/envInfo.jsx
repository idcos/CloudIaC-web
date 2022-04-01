import React, { memo, useState, useEffect, useContext } from 'react';
import { Descriptions, Collapse } from 'antd';
import { AUTO_DESTROY } from 'constants/types';
import { Eb_WP } from 'components/error-boundary';
import { timeUtils } from "utils/time";
import moment from 'moment';
import styles from '../styles.less';
import DetailPageContext from '../detail-page-context';
import CostReport from './cost-report';

const EnvInfo = () => {

  const { envInfo = {}, taskInfo = {} } = useContext(DetailPageContext);

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
    <div className={'envInfoBox'}>
      <div className='info'>
        <div className='title'>环境属性</div>
        <div className='info-border'>
          <Descriptions
            labelStyle={{ color: '#24292F' }}
            contentStyle={{ color: '#57606A' }}
          >
            <Descriptions.Item span={3} label='当前费用'>{'240元'}</Descriptions.Item>
            <Descriptions.Item span={3} label='存活时间'>{formatTTL(envInfo)}</Descriptions.Item>
            <Descriptions.Item span={3} label='云模板'>{envInfo.templateName || '-'}</Descriptions.Item>
            <Descriptions.Item span={3} label='资源数'>{envInfo.resourceCount}</Descriptions.Item>
            <Descriptions.Item span={3} label='更新时间'>{timeUtils.format(envInfo.updatedAt) || '-'}</Descriptions.Item>
            <Descriptions.Item span={3} label='Commit_ID'><span onClick={() => {
              window.open(`${taskInfo.repoAddr.replace('.git', '')}/commit/${taskInfo.commitId}`);
            }} className={styles.linkToCommit}
            >{taskInfo.commitId && taskInfo.commitId.substring(0, 12) || '-'}</span></Descriptions.Item>
            <Descriptions.Item span={3} label='分支/标签'>{envInfo.revision || '-'}</Descriptions.Item>
            <Descriptions.Item span={3} label='密钥'>{envInfo.keyName || '-'}</Descriptions.Item>
            <Descriptions.Item span={3} label='tfvars文件'>{envInfo.tfVarsFile || '-'}</Descriptions.Item>
            <Descriptions.Item span={3} label='playbook文件'>{envInfo.playbook || '-'}</Descriptions.Item>
            <Descriptions.Item span={3} label='部署通道'>{envInfo.runnerId || '-'}</Descriptions.Item>
            <Descriptions.Item span={3} label='target'>{envInfo.target || '-'}</Descriptions.Item>
            <Descriptions.Item span={3} label='推送到分支时重新部署'>{(envInfo.triggers || []).includes('commit') ? '是' : '否' }</Descriptions.Item>
            <Descriptions.Item span={3} label='PR/MR时执行PLAN'>{(envInfo.triggers || []).includes('prmr') ? '是' : '否' }</Descriptions.Item>
            <Descriptions.Item span={3} label='创建人'>{envInfo.creator || '-'}</Descriptions.Item>
            <Descriptions.Item span={3} label='创建时间'>{timeUtils.format(envInfo.createdAt) || '-'}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>
      <div className='cost-report'>
        <div className='cost-report-border'>
          <CostReport />
        </div>
      </div>
    </div>
  );
};

export default Eb_WP()(memo(EnvInfo));
