import React, { useState, useEffect, memo } from 'react';
import { Card, Descriptions, Tag, Space, Empty, Spin, Collapse, Tooltip } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import history from 'utils/history';
import { ENV_STATUS, AUTO_DESTROY, ENV_STATUS_COLOR } from 'constants/types';
import { timeUtils } from "utils/time";
import { Eb_WP } from 'components/error-boundary';
import PolicyStatus from 'components/policy-status';
import EnvTags from '../env-tags';
import envAPI from 'services/env';
import { t } from 'utils/i18n';
import styles from './styles.less';

const EnvList = (props) => {

  const { match, panel, query } = props;
  const { params: { orgId, projectId } } = match;

  const {
    data: resultMap = {
      list: [],
      total: 0
    },
    loading
  } = useRequest(
    () => requestWrapper(
      envAPI.envsList.bind(null, {
        status: panel,
        orgId,
        projectId,
        ...query
      })
    ), {
      refreshDeps: [query]
    }
  );

  const EnvCard = ({ data = {} }) => {

    const [ open, setOpen ] = useState(false);
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
        return t('define.noLimit');
      default:
        const it = AUTO_DESTROY.find(d => d.code === ttl) || {};
        return it.name;
      }
    };

    return (
      <Collapse
        style={{ marginTop: 20 }}
        forceRender={true}
        activeKey='1'
        onChange={() => setOpen(!open)}
      >
        <Collapse.Panel
          key='1'
          showArrow={false}
          extra={(
            <div className={styles.extra}>
              {data.isBilling && (
                <div className={styles.cost}>{data.monthCost.toFixed(2)}元/当月费用</div>
              )}
              <div style={{ fontSize: 12 }}>
                {open ? <DownOutlined /> : <RightOutlined />}
              </div>
            </div>
          )}
          className='common-show-content'
          header={
            <Space
              className={styles.header}
              align='center'
              onClick={() => {
                const tabKey = [ 'failed', 'approving', 'running' ].includes(data.status) ? 'deployJournal' : 'resource';
                history.push(`/org/${orgId}/project/${projectId}/m-project-env/detail/${data.id}?tabKey=${tabKey}`);
              }}
            >
              <div className={styles.status}>
                {ENV_STATUS[data.status] && <Tag color={ENV_STATUS_COLOR[data.status] || 'default'}>{ENV_STATUS[data.status]}</Tag>}
              </div>
              <div className={styles.title}>
                <div
                  className={styles.name}
                >
                  {data.name || '-'}
                </div>
                <div className={styles.id}>ID：{data.id}</div>
              </div>
              <div className={styles.tags}>
                {data.isDrift && (
                  <Tooltip context={'检测到该环境存在漂移资源'}>
                    <Tag
                      onClick={() => {
                        history.push(`/org/${orgId}/project/${projectId}/m-project-env/detail/${data.id}?tabKey=resource`);
                      }}
                      color='#E7AF5F'
                      style={{ color: '#1F1F1F' }}
                    >漂移</Tag>
                  </Tooltip>
                )}
                <PolicyStatus policyStatus={data.policyStatus} onlyShowResultStatus={true} />
                <EnvTags tags={data.tags} />
              </div>
            </Space>
          }
        >
          <Descriptions
            column={4}
            style={{ marginBottom: -16 }}
            labelStyle={{ color: '#24292F' }}
            contentStyle={{ color: '#57606A' }}
          >
            <Descriptions.Item label={t('define.env.field.lifeTime')}>{formatTTL(data)}</Descriptions.Item>
            <Descriptions.Item label={t('define.scope.template')}>{data.templateName || '-'}</Descriptions.Item>
            <Descriptions.Item label={t('define.env.field.resourcesNum')}>{data.resourceCount || '-'}</Descriptions.Item>
            <Descriptions.Item label={t('define.updateTime')}>{timeUtils.format(data.updatedAt) || '-'}</Descriptions.Item>
            {
              open && (
                <>
                  <Descriptions.Item label='Commit ID'>{(data.commitId || '').substring(0, 12) || '-'}</Descriptions.Item>
                  <Descriptions.Item label={`${t('define.branch')}/${t('define.tag')}`}>{data.revision || '-'}</Descriptions.Item>
                  <Descriptions.Item label={t('define.ssh')}>{data.keyName || '-'}</Descriptions.Item>
                  <Descriptions.Item label={t('define.variable.tfVarsFile')}>{data.tfVarsFile || '-'}</Descriptions.Item>
                  <Descriptions.Item label={t('define.variable.playbook')}>{data.playbook || '-'}</Descriptions.Item>
                  <Descriptions.Item label={t('define.env.field.runner')}>{data.runnerId || '-'}</Descriptions.Item>
                  <Descriptions.Item label='target'>{data.target || '-'}</Descriptions.Item>
                  <Descriptions.Item label={t('define.env.field.triggers.commit')}>{(data.triggers || []).includes('commit') ? t('define.yes') : t('define.no') }</Descriptions.Item>
                  <Descriptions.Item label={t('define.env.field.triggers.prmr')}>{(data.triggers || []).includes('prmr') ? t('define.yes') : t('define.no') }</Descriptions.Item>
                  <Descriptions.Item label={t('define.creator')}>{data.creator || '-'}</Descriptions.Item>
                  <Descriptions.Item label={t('define.createdAt')}>{timeUtils.format(data.createdAt) || '-'}</Descriptions.Item>
                </>
              )
            }
          </Descriptions>
        </Collapse.Panel>
      </Collapse>
    );
  };

  return (
    <Spin spinning={loading}>
      {
        resultMap.list.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
        ) : (
          resultMap.list.map(data => <EnvCard data={data}/>)
        )
      }
    </Spin>
  );
};

export default Eb_WP()(memo(EnvList));
