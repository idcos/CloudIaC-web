import React, { useMemo } from 'react';
import { Progress, Card } from 'antd';
import { UpPointIcon, DownPointIcon } from 'components/iconfont';
import { t } from 'utils/i18n';
import styles from '../style.less';

const Index = ({ summaryData = {} }) => {
  const namemap = {
    violated: t('define.scan.status.violated'),
    passed: t('define.scan.status.passed'),
    suppressed: t('define.scan.status.suppressed'),
    failed: t('define.scan.status.failed'),
  };

  const colormap = {
    violated: '#FF4D4F',
    passed: '#52CCA3',
    suppressed: '#4D7CFF',
    failed: '#A7282A',
  };

  const valueToPercent = value => {
    return Math.round(parseFloat(value) * 10000) / 100;
  };

  const info = useMemo(() => {
    const allNumbers = (summaryData.summary || []).reduce(
      (sum, e) => sum + Number(e.value || 0),
      0,
    );
    let datas = (summaryData.summary || []).map(d => ({
      name: d.name,
      value: d.value,
      percent: valueToPercent(d.value / allNumbers),
    }));
    return datas;
  }, [summaryData.summary]);

  return (
    <Card
      bodyStyle={{
        padding: '52px 16px 72px 0px',
      }}
    >
      <div className={styles.title}>
        <div className={styles.titleHeader}>{t('define.activePolicy')}</div>
        <div className={styles.titleContext}>{summaryData.total}</div>
        <div className={styles.titleFooter}>
          <div className={styles.values}>{t('define.last15days')}</div>
          <div className={styles.icon}>
            {summaryData.changes !== 0 && (
              <span>
                {summaryData.changes > 0 ? (
                  <UpPointIcon style={{ padding: '0 5px' }} />
                ) : (
                  <DownPointIcon style={{ padding: '0 5px' }} />
                )}
              </span>
            )}
            {summaryData.changes !== 0 && (
              <span>{`${valueToPercent(summaryData.changes)}%`}</span>
            )}{' '}
          </div>
        </div>
      </div>
      <div className={styles.progressBox}>
        {(info || []).map(item => (
          <div className={styles.progress}>
            <Progress
              strokeColor={{
                '0%': colormap[item.name],
                '100%': colormap[item.name],
              }}
              strokeWidth={8}
              type='circle'
              percent={item.percent}
              format={percent => `${percent} %`}
            />
            <span className={styles.pInfo}>
              <span>{namemap[item.name]}</span>
              <span>
                {t('define.totalScan')} {item.percent} %
              </span>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Index;
