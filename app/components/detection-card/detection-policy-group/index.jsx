import React, { memo, useMemo } from 'react';
import { Card, Divider, Space } from 'antd';
import { Eb_WP } from 'components/error-boundary';
import { t } from 'utils/i18n';
import StatusIcon from '../components/status-icon';
import PolicyCollapse from '../policy-collapse';
import styles from './styles.less';

const Index = ({ info, refresh, targetId, targetType }) => {
  const { name, summary, list } = info || {};
  let { passed, suppressed, failed, violated } = summary || {};
  passed = passed || 0;
  suppressed = suppressed || 0;
  failed = failed || 0;
  violated = violated || 0;

  const status = useMemo(() => {
    if (violated) {
      return 'violated';
    } else {
      return 'passed';
    }
  });

  return (
    <Card
      title={
        <Space align='start' className={styles.title}>
          <StatusIcon type={status} hasWrapper={true} />
          <div>
            <div className='policyGroupName'>{name || '-'}</div>
            <Space className='statistics' split='，'>
              {!!violated && (
                <span className='violated'>
                  {violated}{' '}
                  {t('define.charts.proportion_of_results.status.violated')}
                </span>
              )}
              {!!failed && (
                <span className='failed'>
                  {failed}{' '}
                  {t('define.charts.proportion_of_results.status.failed')}
                </span>
              )}
              {!!passed && (
                <span className='passed'>
                  {passed}{' '}
                  {t('define.charts.proportion_of_results.status.passed')}
                </span>
              )}
              {!!suppressed && (
                <span className='suppressed'>
                  {suppressed}{' '}
                  {t('define.charts.proportion_of_results.status.suppressed')}
                </span>
              )}
            </Space>
          </div>
        </Space>
      }
      style={{ border: '2px solid #E1E4E8' }}
      bodyStyle={{
        padding: '0 24px',
        backgroundColor: '#FAFAFA',
        marginTop: 1,
      }}
    >
      <div className={styles.content}>
        <Space
          direction='vertical'
          size={0}
          style={{ width: '100%' }}
          split={<Divider style={{ margin: 0 }} />}
        >
          {(list || []).map(it => (
            <PolicyCollapse
              data={it}
              refresh={refresh}
              targetId={targetId}
              targetType={targetType}
            />
          ))}
        </Space>
      </div>
    </Card>
  );
};

export default Eb_WP()(memo(Index));
