import React, { memo } from 'react';
import { Card, Divider, Space } from 'antd';
import { Eb_WP } from 'components/error-boundary';
import StatusIcon from '../components/status-icon';
import PolicyCollapse from '../policy-collapse';
import styles from './styles.less';

const Index = (props) => {

  const { info } = props;

  return (
    <Card 
      title={(
        <Space align='start' className={styles.title}>
          <StatusIcon type={info.status} hasWrapper={true} />
          <div>
            <div className='policyGroupName'>{info.policyGroupName || '-'}</div>
            <Space className='statistics' split='，'>
              <span className='failed'>1 不通过</span>
              <span className='passed'>1 通过</span>
              <span className='suppressed'>1 条屏蔽</span>
            </Space>
          </div>
        </Space>
      )}
      bodyStyle={{ padding: '0 24px' }}
    >
      <div className={styles.content}> 
        <Space direction='vertical' size={0} style={{ width: '100%' }} split={<Divider style={{ margin: 0 }} />}> 
          {(info.children || []).map((it) => <PolicyCollapse data={it} />)} 
        </Space>
      </div>
    </Card>
  );
  
};

export default Eb_WP()(memo(Index));
