import React, { useState } from 'react';
import styles from './styles.less';
import { Tabs, Table, Space } from 'antd';
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';
import { TrendDownIcon, TrenDupIcon } from 'components/iconfont';
import { ENV_STATUS } from 'constants/types';
import moment from 'moment';
import sortBy from 'lodash/sortBy';

const { TabPane } = Tabs;
const getColor = (index) => [ "#FF3B3B", "#F5A623", "#3D7FFF" ][index] || '#999999';

export const EnvStat = ({ showData = [], total = 0 }) => {
  const columns = [
    {
      title: '序列号',
      align: 'right',
      width: 26,
      render: (text, record, index) => <span style={{ color: getColor(index) }}>{index + 1}</span>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <div className='title'>
          <span>{ENV_STATUS[record.status]}</span>
        </div>
      )
    },
    {
      title: '占比',
      dataIndex: 'count',
      key: 'count',
      align: 'right',
      width: 60,
      render: (text, record) => <span>{(record.count * 100 / total).toFixed(1)}%</span>
    }
  ];

  const expandedRowRender = (record) => {
    const columns = [
      {
        title: '树状分割线', 
        className: 'tree-split',
        width: 32
      },
      { 
        title: '项目名称', 
        dataIndex: 'name', 
        key: 'name',
        render: (text, record) => (
          <div className='idcos-text-ellipsis title' style={{ maxWidth: 150 }} title={record.name}>
            <span>{record.name}</span>
          </div>
        )
      },
      { 
        title: '占比', 
        dataIndex: 'count', 
        key: 'count', 
        align: 'right',
        width: 60,
        render: (text, record) => <span>{(record.count * 100 / total).toFixed(1)}%</span>
      }
    ];
    const { details } = record || {};
    return (
      <Table 
        columns={columns} 
        dataSource={details} 
        pagination={false} 
        showHeader={false}
        noStyle={true} 
      />
    );
  };

  return (
    <div className={styles.tableWrapper}>
      <h2>概览详情</h2>
      <h3>环境状态占比</h3>
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
            columnWidth: 16,
            // rowExpandable: ({ details }) => details && details.length > 0,
            expandIcon: ({ expanded, onExpand, record }) => (
              expanded ? (
                <CaretDownOutlined onClick={e => onExpand(record, e)} style={{ padding: 2, backgroundColor: '#DAE4E6', color: '#08857C', borderRadius: 2 }}/>
              ) : (
                <CaretRightOutlined onClick={e => onExpand(record, e)} style={{ padding: 2, color: 'rgba(0, 0, 0, 0.6)' }}/>
              )
            )
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
      align: 'right',
      width: 26,
      render: (text, record, index) => <span style={{ color: getColor(index) }}>{index + 1}</span> 
    },
    {
      title: '名称',
      dataIndex: 'resType',
      key: 'resType',
      render: (text, record) => (
        <div className='idcos-text-ellipsis title' style={{ maxWidth: 120 }} title={record.resType}>
          <span>{record.resType}</span>
        </div>
      )
    },
    {
      title: '占比',
      dataIndex: 'count',
      key: 'count',
      align: 'right',
      width: 60,
      render: (text, record) => <span>{(record.count * 100 / total).toFixed(1)}%</span>
    }
  ];
  const expandedRowRender = (record) => {
    const columns = [
      {
        title: '树状分割线', 
        className: 'tree-split',
        width: 32
      },
      { 
        title: '项目名称', 
        dataIndex: 'name', 
        key: 'name',
        render: (text, record) => (
          <div className='idcos-text-ellipsis title' style={{ maxWidth: 150 }} title={record.name}>
            <span>{record.name}</span>
          </div>
        )
      },
      { 
        title: '占比', 
        dataIndex: 'count', 
        key: 'count', 
        align: 'right',
        width: 60,
        render: (text, record) => <span>{(record.count * 100 / total).toFixed(1)}%</span>
      }
    ];
    const { details } = record || {};
    return (
      <Table 
        columns={columns} 
        dataSource={details} 
        pagination={false} 
        showHeader={false}
        noStyle={true} 
      />
    );
  };
  return (
    <div className={styles.tableWrapper}>
      <h2>概览详情</h2>
      <h3>资源类型占比</h3>
      <div className={styles.data_table}>
        <Table 
          rowKey='resType'
          pagination={false} 
          noStyle={true} 
          showHeader={false} 
          dataSource={sortBy(showData, it => -it.count)} 
          columns={columns} 
          expandable={{ 
            expandedRowRender,
            expandRowByClick: true,
            columnWidth: 16,
            // rowExpandable: ({ details }) => details && details.length > 0,
            expandIcon: ({ expanded, onExpand, record }) => (
              expanded ? (
                <CaretDownOutlined onClick={e => onExpand(record, e)} style={{ padding: 2, backgroundColor: '#DAE4E6', color: '#08857C', borderRadius: 2 }}/>
              ) : (
                <CaretRightOutlined onClick={e => onExpand(record, e)} style={{ padding: 2, color: 'rgba(0, 0, 0, 0.6)' }}/>
              )
            )
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
      align: 'right',
      width: 26,
      render: (text, record, index) => <span style={{ color: getColor(index) }}>{index + 1}</span>
    },
    {
      title: '类型',
      dataIndex: 'resType',
      key: 'resType',
      render: (text, record) => (
        <div className='idcos-text-ellipsis title' style={{ maxWidth: 100 }} title={record.resType}>
          <span>{record.resType}</span>
        </div>
      )
    },
    {
      title: '偏差',
      hide: tabKey !== 'this',
      className: 'up',
      width: 40,
      render: (text, record) => (
        <>
          {record.up === 0 && <span>--</span>}
          {record.up > 0 && (
            <Space size={2} align='center'><TrenDupIcon/>{Math.abs(record.up)}</Space>
          )}
          {record.up < 0 && (
            <Space size={2} align='center'><TrendDownIcon/>{Math.abs(record.up)}</Space>
          )}
        </>
      )
    },
    {
      title: '数量',
      dataIndex: 'count',
      align: 'right',
      key: 'count',
      width: 40
    }
  ].filter(it => !it.hide);

  const expandedRowRender = ({ details }) => {
    const columns = [
      {
        title: '树状分割线', 
        className: 'tree-split',
        width: 32
      },
      { 
        title: '项目名称', 
        dataIndex: 'name', 
        key: 'name',
        render: (text, record) => (
          <div className='idcos-text-ellipsis title' style={{ maxWidth: 140 }} title={record.name}>
            <span>{record.name}</span>
          </div>
        )
      },
      { 
        title: '数量', 
        dataIndex: 'count', 
        align: 'right',
        key: 'count',
        width: 60
      }
    ];
    return (
      <Table 
        columns={columns} 
        dataSource={details} 
        pagination={false} 
        showHeader={false}
        noStyle={true} 
      />
    );
  };

  const commonTableProps = {
    rowKey: 'resType',
    pagination: false,
    noStyle: true, 
    showHeader: false,
    columns,
    expandable: { 
      expandedRowRender,
      expandRowByClick: true,
      columnWidth: 20,
      // rowExpandable: ({ details }) => details && details.length > 0,
      expandIcon: ({ expanded, onExpand, record }) => (
        expanded ? (
          <CaretDownOutlined onClick={e => onExpand(record, e)} style={{ padding: 2, backgroundColor: '#DAE4E6', color: '#08857C', borderRadius: 2 }}/>
        ) : (
          <CaretRightOutlined onClick={e => onExpand(record, e)} style={{ padding: 2, color: 'rgba(0, 0, 0, 0.6)' }}/>
        )
      )
    }
  };

  return (
    <div className={styles.tabsWrapper}>
      <h2>项目资源数量</h2>
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
  const [ tabKey, setTabKey ] = useState('last');

  const columns = [
    {
      title: '序列号',
      key: 1,
      align: 'right',
      width: 26,
      render: (text, record, index) => <span style={{ color: getColor(index) }}>{index + 1}</span>
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (text, record) => (
        <span className='title'>{moment(record.date).format('MM/DD')}</span>
      )
    },
    {
      title: '数量',
      dataIndex: 'count',
      align: 'right',
      key: 'count',
      width: 60
    }
  ].filter(it => !it.hide);

  const expandedRowRender = (record) => {
    const { details } = record || {};
    const columns = [
      {
        title: '树状分割线', 
        className: 'tree-split',
        width: 32
      },
      { 
        title: '项目名称', 
        dataIndex: 'name', 
        key: 'name',
        render: (text, record) => (
          <div className='idcos-text-ellipsis title' style={{ maxWidth: 140 }} title={record.name}>
            <span>{record.name}</span>
          </div>
        )
      },
      { 
        title: '数量', 
        dataIndex: 'count', 
        align: 'right',
        key: 'count',
        width: 60
      }
    ];
    return (
      <Table 
        columns={columns} 
        dataSource={details} 
        pagination={false} 
        showHeader={false}
        noStyle={true} 
      />
    );
  };

  const commonTableProps = {
    rowKey: 'date',
    pagination: false,
    noStyle: true, 
    showHeader: false,
    columns,
    expandable: { 
      expandedRowRender,
      expandRowByClick: true,
      columnWidth: 20,
      // rowExpandable: ({ details }) => details && details.length > 0,
      expandIcon: ({ expanded, onExpand, record }) => (
        expanded ? (
          <CaretDownOutlined onClick={e => onExpand(record, e)} style={{ padding: 2, backgroundColor: '#DAE4E6', color: '#08857C', borderRadius: 2 }}/>
        ) : (
          <CaretRightOutlined onClick={e => onExpand(record, e)} style={{ padding: 2, color: 'rgba(0, 0, 0, 0.6)' }}/>
        )
      )
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <h2>概览详情</h2>
      <h3>最近七天资源新增趋势</h3>
      <div className={styles.data_table}>
        <Table 
          {...commonTableProps}
          dataSource={sortBy(this_month, it => -it.count)} 
        />
      </div>
    </div>
  );
};
