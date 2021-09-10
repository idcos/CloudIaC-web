import React, { useState, useEffect } from 'react';
import { Progress, Table, Input, notification, Badge, Card, Divider, Popconfirm } from 'antd';
import moment from 'moment';
import { CaretUpOutlined } from '@ant-design/icons';
import styles from '../style.less';

const Index = () => {

  let colorObj = {
    0: '#6699FF',
    1: '#52CCA3',
    2: '#9580FF',
    3: '#9EBFFF',
    4: '#7D8FB3'

  };
  const list = [ 1, 2, 3, 4, 5 ];
  return <Card bodyStyle={{
    padding: '52px 16px 72px 7%',
    background: `#fff url(/assets/backgroundIcon/corner.svg) no-repeat 95% -1px` 
  }}
  >
    <span className={styles.cardTitle}>策略检测未通过</span>
    {list.map((item, index) => {
      return <div className={styles.lineProgress} style={{ width: '90%' }}>
        <span className={styles.nameTitle}>{item}</span>
        <div style={{ display: 'flex' }}>
          <Progress strokeColor={{
            '0%': colorObj[index],
            '100%': colorObj[index]
          }} percent={30} showInfo={false}
          />
          <span style={{ fontWeight: 'bolder', fontFamily: 'iacNuberFont' }}>{12}</span>
        </div>
      </div>;
    }) }
    
  </Card>;
};

export default Index;
