import React, { memo, useMemo } from 'react';
import { Card, Divider, Space } from 'antd';
import { Eb_WP } from 'components/error-boundary';
import StatusIcon from '../components/status-icon';
import PolicyCollapse from '../policy-collapse';
import styles from './styles.less';

const Index = (props) => {

  const { name, summary, list } = props.info || {};
  let { passed, suppressed, failed, violated } = summary || {};
  passed = passed || 0;
  suppressed = suppressed || 0;
  failed = failed || 0;
  violated = violated || 0;

  const status = useMemo(() => {
    if (passed && !suppressed && !failed && !violated) {
      return 'passed';
    }
    if (suppressed && !passed && !failed && !violated) {
      return 'suppressed';
    }
    if ((failed || violated) && !suppressed && !passed) {
      return 'violated';
    }
    return undefined;
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
      bodyStyle={{ padding: '0 24px' }}
    >
      <div className={styles.content}> 
        <Space direction='vertical' size={0} style={{ width: '100%' }} split={<Divider style={{ margin: 0 }} />}> 
          {(list || []).map((it) => <PolicyCollapse data={it} />)} 
        </Space>
      </div>
    </Card>
  );
  
};

export default Eb_WP()(memo(Index));
