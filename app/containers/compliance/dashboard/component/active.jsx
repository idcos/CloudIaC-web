import React, { useState, useEffect } from 'react';
import { Progress, Table, Input, notification, Badge, Card, Divider, Popconfirm } from 'antd';
import moment from 'moment';
import { CaretUpOutlined } from '@ant-design/icons';
import { UpPointIcon, DownPointIcon } from 'components/iconfont';
import styles from '../style.less';

const Index = () => {
  let aaa = false;
  return <Card bodyStyle={{
    padding: '52px 16px 72px 0px'
  }}
  >
    <div className={styles.title}>
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
    <div className={styles.progressBox}>
      <div className={styles.progress}>
        <Progress strokeWidth={8} type='circle' percent={75} format={percent => `${percent} %`} />
        <span className={styles.pInfo}>
          <span>未通过</span>
          <span>占总扫描次数{8}%</span>
        </span>
      </div>
      <div className={styles.progress}>
        <Progress strokeWidth={8} strokeColor={{
          '0%': '#FF4D4F',
          '100%': '#FF4D4F'
        }} type='circle' percent={75} format={percent => `${percent} %`}
        />
        <span className={styles.pInfo}>
          <span>通过</span>
          <span>占总扫描次数{8}%</span>
        </span>
      </div>
      <div className={styles.progress}>
        <Progress strokeWidth={8} strokeColor={{
          '0%': '#A6C8FF',
          '100%': '#A6C8FF'
        }} type='circle' percent={75} format={percent => `${percent} %`}
        />
        <span className={styles.pInfo}>
          <span>屏蔽</span>
          <span>占总扫描次数{8}%</span>
        </span>
      </div>
      <div className={styles.progress}>
        <Progress strokeWidth={8} strokeColor={{
          '0%': '#A7282A',
          '100%': '#A7282A'
        }} type='circle' percent={75} format={percent => `${percent} %`}
        />
        <span className={styles.pInfo}>
          <span>错误</span>
          <span>占总扫描次数{8}%</span>
        </span>
      </div>
    </div>
  </Card>;
};

export default Index;
