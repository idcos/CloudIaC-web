import React, { useState, useEffect, useContext } from 'react';
import { Card, Divider, List, notification, Radio, Space } from 'antd';

import { ctAPI } from 'services/base';
import { CT } from 'constants/types';
import { statusTextCls } from 'utils/util';
import history from 'utils/history';
import DetailContext from '../DetailContext';
import moment from 'moment';

const Running = ({ routesParams: { curOrg, ctId, ctDetailTabKey, baseUrl } }) => {
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
    <div className='List gap'>
      <Card>
        <div className='tableRender'>
          <List
            loading={loading}
            itemLayout='horizontal'
            dataSource={resultMap.list}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={<h2
                    className='list-title'
                    onClick={() => {
                      history.push(`${baseUrl + ctDetailTabKey}/taskDetail/${item.id}`);
                    }}
                  >
                    {item.creatorName || '-'} {moment(item.createdAt).fromNow() || '-'} 从 {item.repoBranch} {item.commitId}执行作业
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
                  <span className={`status-text ${statusTextCls(item.status).cls}`}>{CT.taskStatusIcon[item.status]} {CT.taskStatus[item.status]}</span>
                  <p>{moment(item.endAt).fromNow()}</p>
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
