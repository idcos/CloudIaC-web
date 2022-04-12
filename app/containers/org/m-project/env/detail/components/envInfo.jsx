import React, { memo, useState, useEffect, useContext } from 'react';
import { Descriptions, Collapse, Empty } from 'antd';
import { AUTO_DESTROY } from 'constants/types';
import { Eb_WP } from 'components/error-boundary';
import { timeUtils } from "utils/time";
import history from "utils/history";
import moment from 'moment';
import styles from '../styles.less';
import DetailPageContext from '../detail-page-context';
import CostReport from './cost-report';
import classNames from 'classnames';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import vcsAPI from 'services/vcs';

const EnvInfo = () => {

  const { tplInfo = {}, envInfo = {}, taskInfo = {}, orgId, projectId, envId } = useContext(DetailPageContext);
  const [ now, setNow ] = useState(moment());

  useEffect(() => {
    const t = setInterval(() => {
      setNow(moment());
    }, 1000);
    return () => {
      clearInterval(t);
    };
  }, []);

  // 跳转repo页面
  const { run: linkToPage } = useRequest(
    (params) => requestWrapper(
      vcsAPI.getReposUrl.bind(null, {
        vcsId: tplInfo.vcsId,
        repoId: tplInfo.repoId,
        revision: taskInfo.revision,
        ...params
      })
    ),
    {
      manual: true,
      onSuccess: (url) => {
        url && window.open(url);
      }
    }
  );

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

  const linkTo = (type) => {
    if (type === 'commit') {
      linkToPage({
        CommitId: taskInfo.commitId
      });
    } else if (type === 'tfVarsFile') {
      linkToPage({
        path: (envInfo.workdir + '/' + envInfo.tfVarsFile).replace('//', '/').replace('///', '/')
      });
    } else if (type === 'playbook') {
      linkToPage({
        path: (envInfo.workdir + '/' + envInfo.playbook).replace('//', '/').replace('///', '/')
      });
    }
  };

  return (
    <div className={'envInfoBox'}>
      <div className='info'>
        <div className='title'>环境属性</div>
        <div className='info-border'>
          <Descriptions
            labelStyle={{ color: '#24292F', fontWeight: 500 }}
            contentStyle={{ color: '#57606A' }}
          >
            {envInfo.isBilling && (
              <Descriptions.Item span={3} label='当月费用'>{envInfo.monthCost ? envInfo.monthCost.toFixed(2) : 0}元</Descriptions.Item>
            )}
            <Descriptions.Item span={3} label='资源数'>{envInfo.resourceCount}</Descriptions.Item>

            <Descriptions.Item span={3} label='存活时间'>{formatTTL(envInfo)}</Descriptions.Item>
            <Descriptions.Item span={3} label='更新时间'>{timeUtils.format(envInfo.updatedAt) || '-'}</Descriptions.Item>

            <Descriptions.Item span={3} label='云模板'><span onClick={() => {
              history.push(`/org/${orgId}/project/${projectId}/m-project-ct`);
            }} className={styles.linkToPage}
            >{envInfo.templateName || '-'}</span></Descriptions.Item>
            <Descriptions.Item span={3} label='分支/标签'>{envInfo.revision || '-'}</Descriptions.Item>
            <Descriptions.Item span={3} label='Commit_ID'>{
              taskInfo.commitId ? (
                <span onClick={() => linkTo('commit')} className={styles.linkToPage}>{taskInfo.commitId.substring(0, 12)}</span>
              ) : '-'
            }</Descriptions.Item>

            <Descriptions.Item span={3} label='密钥'>{envInfo.keyName || '-'}</Descriptions.Item>
            <Descriptions.Item span={3} label='tfvars文件'>{
              envInfo.tfVarsFile ? (
                <span onClick={() => linkTo('tfVarsFile')} className={styles.linkToPage}>{envInfo.tfVarsFile}</span>
              ) : '-'
            }</Descriptions.Item>
            <Descriptions.Item span={3} label='playbook文件'>{
              envInfo.playbook ? (
                <span onClick={() => linkTo('playbook')} className={styles.linkToPage}>{envInfo.playbook}</span>
              ) : '-'
            }</Descriptions.Item>

            <Descriptions.Item span={3} label='部署通道'>{envInfo.runnerId || '-'}</Descriptions.Item>
            <Descriptions.Item span={3} label='target'>{envInfo.target || '-'}</Descriptions.Item>
            <Descriptions.Item span={3} label='推送到分支时重新部署'>{(envInfo.triggers || []).includes('commit') ? '是' : '否' }</Descriptions.Item>
            <Descriptions.Item span={3} label='PR/MR时执行PLAN'>{(envInfo.triggers || []).includes('prmr') ? '是' : '否' }</Descriptions.Item>
           
            <Descriptions.Item span={3} label='创建人'>{envInfo.creator || '-'}</Descriptions.Item>
            <Descriptions.Item span={3} label='创建时间'>{timeUtils.format(envInfo.createdAt) || '-'}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>
      <div className={classNames('cost-report', { 'isBillingStyle': !envInfo.isBilling })} >
        <div className='cost-report-border'>
          {envInfo.isBilling ? (
            <CostReport orgId={orgId} projectId={projectId} envId={envId} />
          ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂未开启费用统计' style={{ marginTop: 200 }} />}
        </div>
      </div>
    </div>
  );
};

export default Eb_WP()(memo(EnvInfo));
