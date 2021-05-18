import React, { useState, useEffect } from 'react';
import { Card, List, notification, Radio } from 'antd';

import { ctAPI } from 'services/base';
import RunningTaskItem from '../components/runningTaskItem/index';

const Running = ({ routesParams: { curOrg, ctId, linkToRunningDetail, ctRunnerList } }) => {
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

  useEffect(() => {
    fetchList();
  }, [query]);


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
            renderItem={(item) => <RunningTaskItem item={item} linkToRunningDetail={linkToRunningDetail} ctRunnerList={ctRunnerList} />}
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
