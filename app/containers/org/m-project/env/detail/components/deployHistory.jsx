import React, { useState, useEffect, memo } from 'react';
import { Card, Table, notification } from 'antd';
import history from 'utils/history';
import moment from 'moment';
import { TASK_STATUS, CT } from 'constants/types';

import { Eb_WP } from 'components/error-boundary';

import { envAPI, orgsAPI } from 'services/base';

const Index = (props) => {
  const { match, panel, routes } = props,
    { params: { orgId, projectId, envId } } = match;
  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [{ name: 1, id: 0 }],
      total: 0
    });

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await envAPI.envsTaskList({
        orgId, projectId, envId
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
  const columns = [
    {
      dataIndex: 'type',
      title: '作业类型',
      render: (t, r) => <span>{CT['taskType'][t] || '-'}</span>
    },
    {
      dataIndex: 'status',
      title: '状态',
      render: (t, r) => <span>{TASK_STATUS[t] || '-'}</span>
    },
    {
      dataIndex: 'result',
      title: '资源变更',
      render: (t, r) => {
        return (<div>{`+${(r.result || {}).resAdded}`}  {`~${(r.result || {}).resChanged}`}  {`-${(r.result || {}).resDestroyed}`}</div>); 
      }
    },
    {
      dataIndex: 'createdAt',
      title: '开始执行时间'
    },
    {
      dataIndex: 'startAt',
      title: '执行时长',
      render: (t, r) => {
        let timeDiff = moment(r.endAt).diff(moment(t), 'second');
        let time = moment.duration(timeDiff, 'seconds'); //得到一个对象，里面有对应的时分秒等时间对象值
        let hours = time.hours(); 
        let minutes = time.minutes();
        let seconds = time.seconds();
        let formats = 'HH:mm:ss';
        if (hours === 0 && minutes === 0) {
          formats = 's';
        } else if (hours === 0) {
          formats = 'mm:ss';
        }
        let times = moment({ h: hours, m: minutes, s: seconds }).format(formats);
        return <span>{(`${times}${times.length <= 2 ? '秒' : ''}` || '')}</span>;
      }
    },
    {
      dataIndex: 'creator',
      title: '执行人'
    },
    {
      dataIndex: 'action',
      title: '操作',
      editable: true,
      width: 80,
      render: (t, r) => {
        return (<a
          onClick={() => {
            history.push(`/org/${orgId}/project/${projectId}/m-project-env/detail/${envId}/deployHistory/task/${r.id}`); 
          }}
        >进入详情</a>); 
      }
    }
  ];
  return <div>
    <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} bodyStyle={{ padding: 5 }} type={'inner'} title={'部署历史'}>
      <Table
        columns={columns}
        dataSource={resultMap.list}
        loading={loading}
        pagination={false}
      />
    </Card>
  </div>
  ;
};

export default Eb_WP()(memo(Index));
