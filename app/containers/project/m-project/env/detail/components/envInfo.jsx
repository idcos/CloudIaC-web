import React, { memo, useState, useEffect, useContext } from 'react';
import { Descriptions, Collapse, Empty, Divider } from 'antd';
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
import { t } from 'utils/i18n';
import vcsAPI from 'services/vcs';

const EnvInfo = () => {

  const { tplInfo = {}, envInfo = {}, taskInfo = {}, orgId, projectId, envId } = useContext(DetailPageContext);
  const [ now, setNow ] = useState(moment());
  const [ urlMap, setUrlMap ] = useState({});

  useEffect(() => {
    const t = setInterval(() => {
      setNow(moment());
    }, 1000);
    return () => {
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    if (taskInfo.id && tplInfo.id && envInfo.id) {
      getUrlMap();
    }
  }, [ taskInfo.id, tplInfo.id, envInfo.id ]);

  const getUrlMap = async () => {
    let data = {};
    await linkToPage({ commitId: taskInfo.commitId }).then((commitUrl) => {
      data.commitUrl = commitUrl;
    });
    await linkToPage({ path: (envInfo.workdir + '/' + envInfo.tfVarsFile).replace('//', '/').replace('///', '/') }).then((tfVarsFileUrl) => {
      data.tfVarsFileUrl = tfVarsFileUrl;
    });
    await linkToPage({ path: (envInfo.workdir + '/' + envInfo.playbook).replace('//', '/').replace('///', '/') }).then((playbookUrl) => {
      data.playbookUrl = playbookUrl;
    });
    setUrlMap(data);
  };

  // 跳转repo页面
  const { run: linkToPage } = useRequest(
    (params) => requestWrapper(
      vcsAPI.getReposUrl.bind(null, {
        vcsId: tplInfo.vcsId,
        repoId: tplInfo.repoId,
        repoRevision: taskInfo.revision,
        ...params
      })
    ),
    {
      manual: true
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
      return t('define.noLimit');
    default:
      const it = AUTO_DESTROY.find(d => d.code === ttl) || {};
      return it.name;
    }
  };

  return (
    <div className={'envInfoBox'}>
      <div className='info'>
        <div className='title'>{t('define.envProps')}</div>
        <div className='info-border'>
          <Descriptions
            labelStyle={{ color: '#24292F', fontWeight: 500 }}
            contentStyle={{ color: '#57606A' }}
          >
            {envInfo.isBilling && (
              <Descriptions.Item span={3} label={t('define.env.field.monthCost')}>{envInfo.monthCost ? envInfo.monthCost.toFixed(2) : 0}{t('define.money.yuan')}</Descriptions.Item>
            )}
            <Descriptions.Item span={3} label={t('define.env.field.resourcesNum')}>{envInfo.resourceCount}</Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginTop: 0, marginBottom: '18px' }}/>
          <Descriptions
            labelStyle={{ color: '#24292F', fontWeight: 500 }}
            contentStyle={{ color: '#57606A' }}
          >
            <Descriptions.Item span={3} label={t('define.env.field.lifeTime')}>{formatTTL(envInfo)}</Descriptions.Item>
            <Descriptions.Item span={3} label={t('define.updateTime')}>{timeUtils.format(envInfo.updatedAt) || '-'}</Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginTop: 0, marginBottom: '18px' }}/>
          <Descriptions
            labelStyle={{ color: '#24292F', fontWeight: 500 }}
            contentStyle={{ color: '#57606A' }}
          >
            <Descriptions.Item span={3} label={t('define.scope.template')}><span onClick={() => {
              history.push(`/org/${orgId}/project/${projectId}/m-project-ct?name=${envInfo.templateName}`);
            }} className={styles.linkToPage}
            >{envInfo.templateName || '-'}</span></Descriptions.Item>
            <Descriptions.Item span={3} label={`${t('define.branch')}/${t('define.tag')}`}>{envInfo.revision || '-'}</Descriptions.Item>
            <Descriptions.Item span={3} label={t('define.workdir')}>{envInfo.workdir || '-'}</Descriptions.Item>
            
            <Descriptions.Item span={3} label='Commit ID'>{
              taskInfo.commitId ? (
                urlMap.commitUrl ? (
                  <span onClick={() => window.open(urlMap.commitUrl)} className={styles.linkToPage}>{taskInfo.commitId.substring(0, 12)}</span>
                ) : taskInfo.commitId.substring(0, 12)
              ) : '-'
            }</Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginTop: 0, marginBottom: '18px' }}/>
          <Descriptions
            labelStyle={{ color: '#24292F', fontWeight: 500 }}
            contentStyle={{ color: '#57606A' }}
          >
            <Descriptions.Item span={3} label={t('define.ssh')}>{envInfo.keyName || '-'}</Descriptions.Item>
            <Descriptions.Item span={3} label={t('define.variable.tfVarsFile')}>{
              envInfo.tfVarsFile ? (
                urlMap.tfVarsFileUrl ? (
                  <span onClick={() => window.open(urlMap.tfVarsFileUrl)} className={styles.linkToPage}>{envInfo.tfVarsFile}</span>
                ) : envInfo.tfVarsFile
              ) : '-'
            }</Descriptions.Item>
            <Descriptions.Item span={3} label={t('define.variable.playbook')}>{
              envInfo.playbook ? (
                urlMap.playbookUrl ? (
                  <span onClick={() => window.open(urlMap.playbookUrl)} className={styles.linkToPage}>{envInfo.playbook}</span>
                ) : envInfo.playbook
              ) : '-'
            }</Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginTop: 0, marginBottom: '18px' }}/>
          <Descriptions
            labelStyle={{ color: '#24292F', fontWeight: 500 }}
            contentStyle={{ color: '#57606A' }}
          >

            <Descriptions.Item span={3} label={t('define.env.field.runner')}>{envInfo.runnerId || '-'}</Descriptions.Item>
            <Descriptions.Item span={3} label='target'>{envInfo.target || '-'}</Descriptions.Item>
            <Descriptions.Item span={3} label={t('define.env.field.triggers.commit')}>{(envInfo.triggers || []).includes('commit') ? t('define.yes') : t('define.no') }</Descriptions.Item>
            <Descriptions.Item span={3} label={t('define.env.field.triggers.prmr')}>{(envInfo.triggers || []).includes('prmr') ? t('define.yes') : t('define.no') }</Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginTop: 0, marginBottom: '18px' }}/>
          <Descriptions
            labelStyle={{ color: '#24292F', fontWeight: 500 }}
            contentStyle={{ color: '#57606A' }}
          >
           
            <Descriptions.Item span={3} label={t('define.creator')}>{envInfo.creator || '-'}</Descriptions.Item>
            <Descriptions.Item span={3} label={t('define.createdAt')}>{timeUtils.format(envInfo.createdAt) || '-'}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>
      <div className={classNames('cost-report', { 'isBillingStyle': !envInfo.isBilling })} >
        <div className='cost-report-border'>
          {envInfo.isBilling ? (
            <CostReport orgId={orgId} projectId={projectId} envId={envId} />
          ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('define.noOpenCostStatistics')} style={{ marginTop: 200 }} />}
        </div>
      </div>
    </div>
  );
};

export default Eb_WP()(memo(EnvInfo));
