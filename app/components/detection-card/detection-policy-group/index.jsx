import React, { memo, useMemo } from 'react';
import { Card, Divider, Space } from 'antd';
import { Eb_WP } from 'components/error-boundary';
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
    if (failed || violated) {
      return 'violated';
    } else {
      return 'passed';
    }
  });

  return (
    <Card 
      title={(
        <Space align='start' className={styles.title}>
          <StatusIcon type={status} hasWrapper={true} />
          <div>
            <div className='policyGroupName'>{name || '-'}</div>
            <Space className='statistics' split='，'>
              {!!(failed || violated) && <span className='failed'>{failed + violated} 不通过</span>}
              {!!passed && <span className='passed'>{passed} 通过</span>}
              {!!suppressed && <span className='suppressed'>{suppressed} 条屏蔽</span>}
            </Space>
          </div>
        </Space>
      )}
      style={{ border: '2px solid #E1E4E8' }}
      bodyStyle={{ padding: '0 24px', backgroundColor: '#FAFAFA', marginTop: 1 }}
    >
      <div className={styles.content}> 
        <Space direction='vertical' size={0} style={{ width: '100%' }} split={<Divider style={{ margin: 0 }} />}> 
          {(list || []).map((it) => <PolicyCollapse data={it} refresh={refresh} targetId={targetId} targetType={targetType} />)} 
        </Space>
      </div>
    </Card>
  );
  
};

export default Eb_WP()(memo(Index));
