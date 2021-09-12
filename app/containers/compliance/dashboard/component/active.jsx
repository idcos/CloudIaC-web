import React from 'react';
import { Progress, Card } from 'antd';
import { UpPointIcon, DownPointIcon } from 'components/iconfont';
import styles from '../style.less';

const Index = ({ summaryData = {} }) => {

  const namemap = {
    violated: '未通过',
    passed: '通过',
    suppressed: '屏蔽',
    failed: '错误'
  };

  const colormap = {
    violated: '#FF4D4F',
    passed: '#52CCA3',
    suppressed: '#4D7CFF',
    failed: '#A7282A'
  };
  
  return <Card bodyStyle={{
    padding: '52px 16px 72px 0px'
  }}
  >
    <div className={styles.title}>
      <div className={styles.titleHeader}>
        活跃策略
      </div>
      <div className={styles.titleContext}>
        {summaryData.total}
      </div>
      <div className={styles.titleFooter}>
        <div className={styles.values}>最近{summaryData.last}天</div>
        <div className={styles.icon}>
          {summaryData.changes != 0 && <span>{summaryData.changes > 0 ? <UpPointIcon style={{ padding: '0 5px' }}/> : <DownPointIcon style={{ padding: '0 5px' }}/>}</span>}
          {summaryData.changes != 0 && <span>{`${summaryData.changes}%`}</span>} </div>
      </div>
    </div>
    <div className={styles.progressBox}>
      {(summaryData.summary || []).map(item => (
        <div className={styles.progress}>
          <Progress strokeColor={{
            '0%': colormap[item.name],
            '100%': colormap[item.name]
          }}strokeWidth={8} type='circle' percent={item.value} format={percent => `${percent} %`}
          />
          <span className={styles.pInfo}>
            <span>{namemap[item.name]}</span>
            <span>占总扫描次数{item.value}%</span>
          </span>
        </div>
      ))}
    </div>
  </Card>;
};

export default Index;
