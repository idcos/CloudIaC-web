import React, { useRef, useEffect } from 'react';
import { Card } from 'antd';
import { chartUtils } from 'components/charts-cfg';
import { UpPointIcon, DownPointIcon } from 'components/iconfont';
import { t } from 'utils/i18n';
import styles from '../style.less';

const Index = ({ summaryData = {} }) => {

  const wrapperRef = useRef();
  let CHART = useRef([
    { key: 'unsolved_rate', domRef: useRef(), ins: null }
  ]);

  const resizeHelper = chartUtils.resizeEventOfDomRef(CHART.current, wrapperRef);

  useEffect(() => {
    // fetchDate();
    resizeHelper.attach();
    return () => resizeHelper.remove();
  }, [wrapperRef.current]);

  useEffect(() => {
    CHART.current.forEach(chart => {
      if (chart.key === 'unsolved_rate') {
        chartUtils.update(chart, { summary: summaryData.summary });
      }
    });
  }, [summaryData.summary]);

  const valueToPercent = (value) => {
    return Math.round(parseFloat(value) * 10000) / 100;
  };

  return <Card bodyStyle={{
    padding: '52px 16px 0'
  }}
  >  
    <div className={styles.title} style={{ paddingBottom: 0 }}>
      <div className={styles.titleHeader}>
        {t('define.unresolvedErrorPolicy')}
      </div>
      <div className={styles.titleContext}>
        {summaryData.total}
      </div>
      <div className={styles.titleFooter}>
        <div className={styles.values}>{t('define.last15days')}</div>
        <div className={styles.icon}>
          {summaryData.changes != 0 && <span>{summaryData.changes > 0 ? <UpPointIcon style={{ padding: '0 5px' }}/> : <DownPointIcon style={{ padding: '0 5px' }}/>}</span>}
          {summaryData.changes != 0 && <span>{`${valueToPercent(summaryData.changes)}%`}</span>} </div>
      </div>
    </div>
    <div ref={wrapperRef}>
      {CHART.current.map(chart => <div>
        <div ref={chart.domRef} style={{ width: '100%', height: 279 }}></div>
      </div>)}
    </div>
  </Card>;
};

export default Index;

