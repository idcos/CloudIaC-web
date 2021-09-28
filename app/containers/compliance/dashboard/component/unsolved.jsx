import React, { useRef, useEffect } from 'react';
import { Card } from 'antd';
import { chartUtils } from 'components/charts-cfg';
import { UpPointIcon, DownPointIcon } from 'components/iconfont';
import styles from '../style.less';

const Index = ({ summaryData = {} }) => {

  useEffect(() => {
    // fetchDate();
    resizeHelper.attach();
    return resizeHelper.remove();
  }, []);

  useEffect(() => {
    CHART.current.forEach(chart => {
      if (chart.key === 'unsolved_rate') {
        chartUtils.update(chart, { summary: summaryData.summary });
      }
    });
  }, [summaryData.summary]);

  let CHART = useRef([
    { key: 'unsolved_rate', domRef: useRef(), ins: null }
  ]);

  const resizeHelper = chartUtils.resizeEvent(CHART);

  const valueToPercent = (value) => {
    return Math.round(parseFloat(value) * 10000) / 100;
  };

  return <Card bodyStyle={{
    padding: '52px 16px 0'
  }}
  >  
    <div className={styles.title} style={{ paddingBottom: 0 }}>
      <div className={styles.titleHeader}>
        未解决错误策略
      </div>
      <div className={styles.titleContext}>
        {summaryData.total}
      </div>
      <div className={styles.titleFooter}>
        <div className={styles.values}>最近15天</div>
        <div className={styles.icon}>
          {summaryData.changes != 0 && <span>{summaryData.changes > 0 ? <UpPointIcon style={{ padding: '0 5px' }}/> : <DownPointIcon style={{ padding: '0 5px' }}/>}</span>}
          {summaryData.changes != 0 && <span>{`${valueToPercent(summaryData.changes)}%`}</span>} </div>
      </div>
    </div>
    {CHART.current.map(chart => <div>
      <div ref={chart.domRef} style={{ width: '100%', height: 279 }}></div>
    </div>)}
  </Card>;
};

export default Index;

