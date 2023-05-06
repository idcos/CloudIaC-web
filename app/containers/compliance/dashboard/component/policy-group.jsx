import React, { useMemo } from 'react';
import { Progress, Card, Empty } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
import { t } from 'utils/i18n';
import styles from '../style.less';

const Index = ({ summaryData = [] }) => {
  let colorObj = {
    0: '#6699FF',
    1: '#52CCA3',
    2: '#9580FF',
    3: '#9EBFFF',
    4: '#7D8FB3',
  };

  const formatPercent = value => {
    return Math.round(parseFloat(value) * 10000) / 100;
  };

  const data = useMemo(() => {
    const allNumbers = summaryData.reduce(
      (sum, e) => sum + Number(e.value || 0),
      0,
    );
    let datas = summaryData.map(d => ({
      name: d.name,
      value: d.value,
      percent: formatPercent(d.value / allNumbers),
    }));
    if (datas.length < 5 && datas.length !== 0) {
      let count = 5 - datas.length;
      for (let i = 0; i < count; i++) {
        datas.push({
          name: '-',
          value: '-',
          percent: 0,
        });
      }
    }
    return datas;
  }, [summaryData]);

  return (
    <Card className={styles.card}>
      <div className='top5'>{t('define.policyGroup.top5')}</div>
      <span className='title'>{t('define.policyGroup.violated')}</span>
      {data.length === 0 ? (
        <Empty
          image={<DashboardOutlined />}
          imageStyle={{
            fontSize: 24,
            height: 26,
            color: '#E6F0F0',
            marginTop: 50,
          }}
          description={<span>{t('define.policyGroup.empty')}</span>}
        />
      ) : (
        <>
          {data.map((item, index) => {
            return (
              <div className={styles.lineProgress} style={{ width: '90%' }}>
                <span className={styles.nameTitle}>{item.name || ''}</span>
                <div style={{ display: 'flex' }}>
                  <Progress
                    strokeColor={{
                      '0%': colorObj[index],
                      '100%': colorObj[index],
                    }}
                    percent={item.percent || 0}
                    style={{ width: '95%' }}
                    showInfo={false}
                  />
                  <span
                    style={{
                      fontWeight: 'bolder',
                      fontFamily: 'iacNuberFont',
                      width: '5%',
                      paddingLeft: 5,
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              </div>
            );
          })}
        </>
      )}
    </Card>
  );
};

export default Index;
