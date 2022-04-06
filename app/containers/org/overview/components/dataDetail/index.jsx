import React, { useState } from 'react';
import styles from './styles.less';
import { Tabs, Table, Space } from 'antd';
import { TrendDownIcon, TrenDupIcon } from 'components/iconfont';
import { ENV_STATUS } from 'constants/types';
const { TabPane } = Tabs;
const d = [
  { name: "eip", isRise: false, proportion: "35%" }, 
  { name: "slb1", isRise: true, proportion: "32%" }, 
  { name: "vpc12", isRise: false, proportion: "31%" }, 
  { name: "oss123", isRise: true, proportion: "32%" }, 
  { name: "sms1234", isRise: false, proportion: "30%" }
];

const color = [ "#FF3B3B", "#F5A623", "#3D7FFF" ];
export const EnvStat = ({ showData = [], total = 0 }) => {
  const columns = [
    {
      title: '序列号',
      render: (text, record, index) => <span style={{ color: color[index] || '#999999' }}>{index + 1}</span>
    },
    {
      title: '名称',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <Space>
          <span>{ENV_STATUS[record.status]}</span>
        </Space>
      )
    },
    {
      title: '占比',
      dataIndex: 'count',
      key: 'count',
      render: (text, record) => <span>{(record.count * 100 / total).toFixed(1)}%</span>
    }
  ];

  const expandedRowRender = (record) => {
    const columns = [
      { 
        title: '项目名称', 
        dataIndex: 'name', 
        key: 'name' 
      },
      { 
        title: '占比', 
        dataIndex: 'count', 
        key: 'count', 
        render: (text, record) => <span>{(record.count * 100 / total).toFixed(1)}%</span>
      }
    ];
    const { projects } = record || {};
    return (
      <Table 
        columns={columns} 
        dataSource={projects} 
        pagination={false} 
        showHeader={false}
        noStyle={true} 
      />
    );
  };

  return (
    <div className={styles.resStat_content}>
      <h2>概览详情</h2>
      <h3>资源类型占比</h3>
      <div className={styles.data_table}>
        <Table 
          rowKey='status'
          pagination={false} 
          noStyle={true} 
          showHeader={false} 
          dataSource={showData} 
          columns={columns} 
          expandable={{ 
            expandedRowRender,
            expandRowByClick: true,
            columnWidth: 20
          }}
        />
      </div>
    </div>
  );
};

export const ResStat = ({ showData = [], total = 0 }) => {
  const columns = [
    {
      title: '序列号',
      key: 1,
      render: (text, record, index) => <span style={{ color: color[index] }}>{index + 1}</span> 
    },
    {
      title: '名称',
      dataIndex: 'resType',
      key: 'resType',
      render: (text, record) => (
        <Space>
          <span>{record.resType}</span>
        </Space>
      )
    },
    {
      title: '占比',
      dataIndex: 'count',
      key: 'count',
      render: (text, record) => <span>{(record.count * 100 / total).toFixed(1)}%</span>
    }
  ];
  const expandedRowRender = (record) => {
    const columns = [
      { 
        title: '项目名称', 
        dataIndex: 'name', 
        key: 'name' 
      },
      { 
        title: '占比', 
        dataIndex: 'count', 
        key: 'count', 
        render: (text, record) => <span>{(record.count * 100 / total).toFixed(1)}%</span>
      }
    ];
    const { projects } = record || {};
    return (
      <Table 
        columns={columns} 
        dataSource={projects} 
        pagination={false} 
        showHeader={false}
        noStyle={true} 
      />
    );
  };
  return (
    <div className={styles.resStat_content}>
      <h2>概览详情</h2>
      <h3>资源类型占比</h3>
      <div className={styles.data_table}>
        <Table 
          rowKey='resType'
          pagination={false} 
          noStyle={true} 
          showHeader={false} 
          dataSource={showData} 
          columns={columns} 
          expandable={{ 
            expandedRowRender,
            expandRowByClick: true,
            columnWidth: 20
          }}
        />
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
