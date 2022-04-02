import React, { useState } from 'react';
import styles from './styles.less';
import { Tabs, Table } from 'antd';
import { TrendDownIcon, TrenDupIcon } from 'components/iconfont';
const { TabPane } = Tabs;
const d = [
  { name: "eip", isRise: false, proportion: "35%" }, 
  { name: "slb1", isRise: true, proportion: "32%" }, 
  { name: "vpc12", isRise: false, proportion: "31%" }, 
  { name: "oss123", isRise: true, proportion: "32%" }, 
  { name: "sms1234", isRise: false, proportion: "30%" }
];

const color = [ "#FF3B3B", "#F5A623", "#3D7FFF" ];
export const EnvStat = () => {
  const columns = [
    {
      title: '序列号',
      key: 1,
      render: (text, record, index) => <span style={{ color: color[index] }}>{index + 1}</span>
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <span>{record.name} <span style={{ marginLeft: '13px' }}>
        {record.isRise ? <TrenDupIcon/> : <TrendDownIcon/>} 
      </span> 
      </span>
    },
    {
      title: '占比',
      dataIndex: 'proportion',
      key: 'proportion'
    }
  ];
  return (
    <div className={styles.resStat_content}>
      <h2>概览详情</h2>
      <h3>资源类型占比</h3>
      <div className={styles.data_table}>
        <Table pagination={false} noStyle={true} showHeader={false} dataSource={d} columns={columns} />
      </div>
    </div>
  );
};

export const ResStat = () => {
  const columns = [
    {
      title: '序列号',
      key: 1,
      render: (text, record, index) => <span style={{ color: color[index] }}>{index + 1}</span> 
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <span>{record.name} <span style={{ marginLeft: '13px' }}>
        {record.isRise ? <TrenDupIcon/> : <TrendDownIcon/>} 
      </span> 
      </span>
    },
    {
      title: '占比',
      dataIndex: 'proportion',
      key: 'proportion'
    }
  ];
  return (
    <div className={styles.resStat_content}>
      <h2>概览详情</h2>
      <h3>资源类型占比</h3>
      <div className={styles.data_table}>
        <Table pagination={false} noStyle={true} showHeader={false} dataSource={d} columns={columns} />
      </div>
    </div>
  );
};

export const ProjectStat = () => {

  const columns = [
    {
      title: '序列号',
      key: 1,
      render: (text, record, index) => <span style={{ color: color[index] }}>{index + 1}</span>
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <span>{record.name} <span style={{ marginLeft: '13px' }}>
        {record.isRise ? <TrenDupIcon/> : <TrendDownIcon/>} 
      </span> 
      </span>
    },
    {
      title: '占比',
      dataIndex: 'proportion',
      key: 'proportion'
    }
  ];
  return (
    <div className={styles.projectStat}>
      <h2>环境资源数量</h2>
      <Tabs defaultActiveKey='1' onChange={(v) => console.log(v)}>
        <TabPane tab='上月' key='1'>
          <div className={styles.data_table}>
            <Table pagination={false} noStyle={true} showHeader={false} dataSource={d} columns={columns} />
          </div>
        </TabPane>
        <TabPane tab='本月' key='2'>
          <div className={styles.data_table}>
            <Table pagination={false} noStyle={true} showHeader={false} dataSource={d} columns={columns} />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export const ResGrowTrend = () => {
  return (
    <div>
      
    </div>
  );
};
