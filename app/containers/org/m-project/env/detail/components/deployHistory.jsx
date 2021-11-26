import React, { memo, useContext } from 'react';
import { Card, Table, Tag, Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { useSearchFormAndTable } from 'utils/hooks';
import { requestWrapper } from 'utils/request';
import history from 'utils/history';
import ChangeInfo from 'components/change-info';
import { timeUtils } from "utils/time";
import { TASK_STATUS, TASK_STATUS_COLOR, TASK_TYPE } from 'constants/types';
import { Eb_WP } from 'components/error-boundary';
import taskAPI from 'services/task';
import DetailPageContext from '../detail-page-context';

const DeployHistory = () => {

  const { orgId, projectId, envId } = useContext(DetailPageContext);

  // 列表查询
  const {
    loading: tableLoading,
    data: tableData,
    run: fetchList,
  } = useRequest(
    (params) => requestWrapper(
      taskAPI.envsTaskList.bind(null, {
        orgId, 
        projectId, 
        envId,
        ...params
      })
    ), {
      manual: true
    }
  );

  // 表单搜索和table关联hooks
  const { 
    tableProps
  } = useSearchFormAndTable({
    tableData,
    onSearch: (params) => {
      const { current: currentPage, ...restParams } = params;
      fetchList({ currentPage, ...restParams });
    }
  });

  const columns = [
    {
      dataIndex: 'type',
      title: '作业类型',
      width: 168,
      ellipsis: true,
      render: (t, r) => <span>{TASK_TYPE[t] || '-'}</span>
    },
    {
      dataIndex: 'status',
      title: '状态',
      width: 134,
      ellipsis: true,
      render: (t, r) => (
        <>
          {
            TASK_STATUS[t] ? (
              <Tag color={TASK_STATUS_COLOR[t] || 'default'}>{TASK_STATUS[t]}</Tag>
            ) : '-'
          }
          {
            t === 'failed' && r.message ? (
              <Tooltip title={r.message}>
                <InfoCircleFilled style={{ color: '#ff4d4f' }} />
              </Tooltip>
            ) : null
          }
        </>
      )
    },
    {
      dataIndex: 'result',
      title: '资源变更',
      width: 153,
      ellipsis: true,
      render: (t, r) => {
        return <ChangeInfo {...r.result} />;
      }
    },
    {
      dataIndex: 'createdAt',
      title: '开始执行时间',
      width: 180,
      ellipsis: true,
      render: (t) => timeUtils.format(t)
    },
    {
      dataIndex: 'startAt',
      title: '执行时长',
      width: 180,
      ellipsis: true,
      render: (t, r) => timeUtils.diff(r.endAt, t)
    },
    {
      dataIndex: 'creator',
      title: '执行人',
      width: 130,
      ellipsis: true
    },
    {
      dataIndex: 'action',
      title: '操作',
      width: 169,
      ellipsis: true,
      fixed: 'right',
      render: (t, r) => {
        return (<a
          onClick={() => {
            history.push(`/org/${orgId}/project/${projectId}/m-project-env/detail/${envId}/task/${r.id}`); 
          }}
        >进入详情</a>); 
      }
    }
  ];

  return <div>
    <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} bodyStyle={{ padding: 5 }} type={'inner'} title={'部署历史'}>
      <Table
        columns={columns}
        scroll={{ x: 'min-content', y: 570 }}
        loading={tableLoading}
        {...tableProps}
      />
    </Card>
  </div>
  ;
};

export default Eb_WP()(memo(DeployHistory));
