import React, { useState, useEffect, useContext } from 'react';
import { Card, Divider, List, notification, Radio, Space } from 'antd';
import { timeUtils } from 'utils/time';

import { ctAPI } from 'services/base';
import { CT } from 'constants/types';
import DetailContext from '../DetailContext';

const statusTextCls = (status) => {
  let cls = '';
  switch (status) {
    case 'failed':
      cls = 'danger';
      break;
    case 'pending':
      cls = 'normal';
      break;
    default:
      break;
  }
  return cls;
};

const Running = ({ curOrg, detailInfo, ctId, setTabs, setCurTask }) => {
  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [],
      total: 0
    }),
    [ query, setQuery ] = useState({
      pageNo: 1,
      pageSize: 10,
      status: 'all'
    });

  const { refreshTimeStamp } = useContext(DetailContext);

  useEffect(() => {
    fetchList();
  }, [ query, refreshTimeStamp ]);


  const fetchList = async () => {
    try {
      setLoading(true);
      const { status, ...restQuery } = query;
      const res = await ctAPI.listTask({
        ...restQuery,
        status: status == 'all' ? null : status,
        templateId: ctId,
        orgId: curOrg.id
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setResultMap({
        list: res.result.list || [],
        total: res.result.total || 0
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const changeQuery = (payload) => {
    setQuery({
      ...query,
      ...payload
    });
  };

  return <div className='running'>
    <Radio.Group
      onChange={e => changeQuery({ status: e.target.value, pageNo: 1 })}
      value={query.status}
    >
      <Radio.Button value='running'>当前运行</Radio.Button>
      <Radio.Button value='all'>全部运行</Radio.Button>
    </Radio.Group>
    <div className='runningList'>
      <Card>
        <div className='tableRender'>
          <List
            loading={loading}
            itemLayout='horizontal'
            dataSource={resultMap.list}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={<h2 onClick={() => {
                    setCurTask(item.id);
                    setTabs('task');
                  }}
                  >
                    <a>{item.creator || '-'} {timeUtils.format(item.createdAt) || '-'} 从 {item.repoBranch} {item.commitId}</a>
                  </h2>}
                  description={
                    <Space split={<Divider type='vertical' />}>
                      <span>{item.guid}</span>
                      <span>{CT.taskType[item.taskType]}</span>
                      <span>{item.ctServiceId}</span>
                    </Space>
                  }
                />
                <div className='list-content'>
                  <span className={`status-text ${statusTextCls(item.status)}`}>{CT.taskStatusIcon[item.status]} {CT.taskStatus[item.status]}</span>
                  <p>{timeUtils.format(item.endAt)}</p>
                </div>
              </List.Item>
            )}
            pagination={{
              current: query.pageNo,
              pageSize: query.pageSize,
              total: resultMap.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共${total}条`,
              onChange: (page, pageSize) => {
                changeQuery({
                  pageNo: page,
                  pageSize
                });
              }
            }}
          />
        </div>
      </Card>
    </div>
  </div>;
};

export default Running;
