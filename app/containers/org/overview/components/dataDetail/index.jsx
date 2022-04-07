import React, { useState } from 'react';
import styles from './styles.less';
import { Tabs, Table, Space } from 'antd';
import { TrendDownIcon, TrenDupIcon } from 'components/iconfont';
import { ENV_STATUS } from 'constants/types';
import sortBy from 'lodash/sortBy';

const { TabPane } = Tabs;
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
          dataSource={sortBy(showData, it => -it.count)} 
          columns={columns} 
          expandable={{ 
            expandedRowRender,
            expandRowByClick: true,
            columnWidth: 20,
            rowExpandable: ({ projects }) => projects && projects.length > 0
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
            columnWidth: 20,
            rowExpandable: ({ projects }) => projects && projects.length > 0
          }}
        />
      </div>
    </div>
  );
};

export const ProjectStat = ({ showData }) => {

  const { last_month = [], this_month = [] } = showData || {};
  const [ tabKey, setTabKey ] = useState('last');

  const columns = [
    {
      title: '序列号',
      key: 1,
      render: (text, record, index) => <span style={{ color: color[index] }}>{index + 1}</span>
    },
    {
      title: '类型',
      dataIndex: 'resType',
      key: 'resType',
      render: (text, record) => (
        <Space>
          <span>{record.resType}</span>
          {tabKey === 'this' && (
            record.isRise ? <TrenDupIcon/> : <TrendDownIcon/>
          )}
        </Space>
      )
    },
    {
      title: '数量',
      dataIndex: 'count',
      key: 'count'
    }
  ];

  const expandedRowRender = ({ projects }) => {
    const columns = [
      { 
        title: '项目名称', 
        dataIndex: 'name', 
        key: 'name' 
      },
      { 
        title: '数量', 
        width: 60,
        dataIndex: 'count', 
        key: 'count'
      }
    ];
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

  const commonTableProps = {
    pagination: false,
    noStyle: true, 
    showHeader: false,
    columns,
    expandable: { 
      expandedRowRender,
      expandRowByClick: true,
      columnWidth: 20,
      rowExpandable: ({ projects }) => projects && projects.length > 0
    }
  };

  return (
    <div className={styles.projectStat}>
      <h2>环境资源数量</h2>
      <Tabs activeKey={tabKey} onChange={(v) => setTabKey(v)}>
        <TabPane tab='上月' key='last'>
          <div className={styles.data_table}>
            <Table 
              {...commonTableProps}
              dataSource={sortBy(last_month, it => -it.count)} 
            />
          </div>
        </TabPane>
        <TabPane tab='本月' key='this'>
          <div className={styles.data_table}>
            <Table 
              {...commonTableProps}
              dataSource={sortBy(this_month, it => -it.count)} 
            />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export const ResGrowTrend = ({ showData }) => {

  const { last_month = [], this_month = [] } = showData || {};
  console.log(1, showData);
  const [ tabKey, setTabKey ] = useState('last');

  const columns = [
    {
      title: '序列号',
      key: 1,
      render: (text, record, index) => <span style={{ color: color[index] }}>{index + 1}</span>
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (text, record) => (
        <Space>
          <span>{record.date}</span>
          {tabKey === 'this' && (
            record.isRise ? <TrenDupIcon/> : <TrendDownIcon/>
          )}
        </Space>
      )
    },
    {
      title: '数量',
      dataIndex: 'count',
      key: 'count'
    }
  ];

  const expandedRowRender = (record) => {
    const { projects } = record || {};
    const columns = [
      { 
        title: '项目名称', 
        dataIndex: 'name', 
        key: 'name' 
      },
      { 
        title: '数量', 
        width: 60,
        dataIndex: 'count', 
        key: 'count'
      }
    ];
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

  const commonTableProps = {
    pagination: false,
    noStyle: true, 
    showHeader: false,
    columns,
    expandable: { 
      expandedRowRender,
      expandRowByClick: true,
      columnWidth: 20,
      rowExpandable: ({ projects }) => projects && projects.length > 0
    }
  };

  return (
    <div className={styles.projectStat}>
      <h2>环境资源数量</h2>
      <Tabs activeKey={tabKey} onChange={(v) => setTabKey(v)}>
        <TabPane tab='上月' key='last'>
          <div className={styles.data_table}>
            <Table 
              {...commonTableProps}
              dataSource={sortBy(last_month, it => -it.count)} 
            />
          </div>
        </TabPane>
        <TabPane tab='本月' key='this'>
          <div className={styles.data_table}>
            <Table 
              {...commonTableProps}
              dataSource={sortBy(this_month, it => -it.count)} 
            />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};
