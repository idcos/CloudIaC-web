import React, { useRef, useEffect } from 'react';
import { Card } from 'antd';
import { chartUtils } from 'components/charts-cfg';
import { UpPointIcon, DownPointIcon } from 'components/iconfont';
import styles from '../style.less';

const Index = () => {
   
  useEffect(() => {
    // fetchDate();
    resizeHelper.attach();
    return resizeHelper.remove();
  }, []);

  useEffect(() => {
    CHART.current.forEach(chart => {
      if (chart.key === 'unsolved_rate') {
        chartUtils.update(chart, {});
      }
    });
  }, [ ]);

  let CHART = useRef([
    { key: 'unsolved_rate', domRef: useRef(), ins: null }
  ]);
  const resizeHelper = chartUtils.resizeEvent(CHART);
  let aaa = true;
  return <Card bodyStyle={{
    padding: '52px 16px 0'
  }}
  > 
    <div className={styles.title} style={{ paddingBottom: 0 }}>
      <div className={styles.titleHeader}>
        活跃策略
      </div>
      <div className={styles.titleContext}>
        90
      </div>
      <div className={styles.titleFooter}>
        <div className={styles.values}>最近15天</div>
        <div className={styles.icon}>
          {aaa ? <UpPointIcon style={{ padding: '0 5px' }}/> : <DownPointIcon style={{ padding: '0 5px' }}/>}
          0.9% </div>
      </div>
    </div>
    {CHART.current.map(chart => <div>
      <div ref={chart.domRef} style={{ width: '100%', height: 279 }}></div>
    </div>)}
  </Card>;
};

export default Index;

