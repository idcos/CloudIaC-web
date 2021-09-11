import React, { useMemo, useEffect } from 'react';
import { Progress, Table, Input, notification, Badge, Card, Divider, Popconfirm } from 'antd';
import moment from 'moment';
import { CaretUpOutlined } from '@ant-design/icons';
import styles from '../style.less';

const Index = ({ summaryData = [] }) => {

  let colorObj = {
    0: '#6699FF',
    1: '#52CCA3',
    2: '#9580FF',
    3: '#9EBFFF',
    4: '#7D8FB3'

  };

  const valueToPercent = (value) => {
    return Math.round(parseFloat(value) * 10000) / 100;
  };

  const data = useMemo(() => {
    const allNumbers = summaryData.reduce((sum, e) => sum + Number(e.value || 0), 0);
    let datas = summaryData.map(d => ({
      name: d.name, value: d.value, percent: valueToPercent(d.value / allNumbers)
    }));
    return datas;
  }, [summaryData]);

  const list = [ 1, 2, 3, 4, 5 ];
  return <Card bodyStyle={{
    padding: '52px 16px 72px 7%',
    background: `#fff url(/assets/backgroundIcon/cornergroup.svg) no-repeat 95% -1px` 
  }}
  >
    <span className={styles.cardTitle}>策略组检测未通过</span>
    {data.map((item, index) => {
      return <div className={styles.lineProgress} style={{ width: '90%' }}>
        <span className={styles.nameTitle}>{item.name || ''}</span>
        <div style={{ display: 'flex' }}>
          <Progress strokeColor={{
            '0%': colorObj[index],
            '100%': colorObj[index]
          }} percent={item.percent || 0} style={{ width: '95%' }} showInfo={false}
          />
          <span style={{ fontWeight: 'bolder', fontFamily: 'iacNuberFont', width: '5%' }}>{item.value || ''}</span>
        </div>
      </div>;
    }) }
    
  </Card>;
};

export default Index;
