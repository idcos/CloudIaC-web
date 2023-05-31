/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo, useContext, useState, useEffect } from 'react';
import { Card, Table, Tag, Tooltip, Select, Input, Space } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { useSearchFormAndTable } from 'utils/hooks';
import { requestWrapper } from 'utils/request';
import history from 'utils/history';
import ChangeInfo from 'components/change-info';
import { timeUtils } from 'utils/time';
import {
  TASK_STATUS,
  TASK_STATUS_COLOR,
  TASK_TYPE,
  DEPLOY_HISTORY_SOURCE_ENUM,
} from 'constants/types';
import { Eb_WP } from 'components/error-boundary';
import taskAPI from 'services/task';
import { t } from 'utils/i18n';
import DetailPageContext from '../detail-page-context';
const { Search } = Input;

const DeployHistory = () => {
  const { orgId, projectId, envId } = useContext(DetailPageContext);
  const [searchParams, setSearchParams] = useState({});
  const [searchCount, setSearchCount] = useState(1);
  // 列表查询
  const {
    loading: tableLoading,
    data: tableData,
    run: fetchList,
  } = useRequest(
    () =>
      requestWrapper(
        taskAPI.envsTaskList.bind(null, {
          orgId,
          projectId,
          envId,
          ...searchParams,
        }),
      ),
    {
      debounceInterval: 500, // 防抖
      manual: true,
    },
  );

  // 表单搜索和table关联hooks
  const { tableProps } = useSearchFormAndTable({
    tableData,
  });

  const columns = [
    {
      dataIndex: 'type',
      title: t('define.task.field.type'),
      width: 168,
      ellipsis: true,
      render: (t, r) => <span>{TASK_TYPE[t] || '-'}</span>,
    },
    {
      dataIndex: 'status',
      title: t('define.status'),
      width: 134,
      ellipsis: true,
      render: (t, r) => (
        <>
          {TASK_STATUS[t] ? (
            <Tag color={TASK_STATUS_COLOR[t] || 'default'}>
              {TASK_STATUS[t]}
            </Tag>
          ) : (
            '-'
          )}
          {t === 'failed' && r.message ? (
            <Tooltip title={r.message}>
              <InfoCircleFilled style={{ color: '#ff4d4f' }} />
            </Tooltip>
          ) : null}
        </>
      ),
    },
    {
      dataIndex: 'result',
      title: t('define.task.field.result'),
      width: 120,
      ellipsis: true,
      render: (t, r) => {
        return <ChangeInfo {...r.result} />;
      },
    },
    {
      dataIndex: 'createdAt',
      title: t('define.task.field.createdAt'),
      width: 178,
      ellipsis: true,
      render: t => timeUtils.format(t),
    },
    {
      dataIndex: 'startAt',
      title: t('define.task.field.duration'),
      width: 178,
      ellipsis: true,
      render: (t, r) => timeUtils.diff(r.endAt, t),
    },
    {
      dataIndex: 'source',
      title: t('define.task.field.source'),
      width: 120,
      render: (t, { sourceSys }) => (
        <>
          {DEPLOY_HISTORY_SOURCE_ENUM[t]}
          {sourceSys ? `（${sourceSys.toLocaleUpperCase()}）` : null}
        </>
      ),
    },
    {
      dataIndex: 'creator',
      title: t('define.task.field.creator'),
      width: 120,
      ellipsis: true,
      render: (_, r) => {
        return r.creator && r.tokenName
          ? `${r.creator}(${r.tokenName})`
          : r.creator || '-';
      },
    },
    {
      dataIndex: 'action',
      title: t('define.action'),
      width: 90,
      ellipsis: true,
      fixed: 'right',
      render: (_, r) => {
        return (
          <a
            onClick={() => {
              history.push(
                `/org/${orgId}/project/${projectId}/m-project-env/detail/${envId}/task/${r.id}`,
              );
            }}
          >
            {t('define.action.enter')}
          </a>
        );
      },
    },
  ];

  const triggerTypeArr = () => {
    let tempArr = [];
    for (const key in DEPLOY_HISTORY_SOURCE_ENUM) {
      tempArr.push({ value: key, label: DEPLOY_HISTORY_SOURCE_ENUM[key] });
    }
    return tempArr;
  };
  const taskTypeArr = () => {
    let tempArr = [];
    for (const key in TASK_TYPE) {
      tempArr.push({ value: key, label: TASK_TYPE[key] });
    }
    return tempArr;
  };

  const searchParamsChange = params => {
    setSearchParams(preValue => ({ ...preValue, ...params }));
    setSearchCount(preValue => preValue + 1);
  };

  useEffect(() => {
    fetchList();
  }, [searchCount]);

  const title = (
    <div>
      <span style={{ lineHeight: '32px' }}>{t('define.deployHistory')}</span>
      <span style={{ float: 'right' }}>
        <Space>
          <Select
            allowClear={true}
            style={{ width: 258 }}
            placeholder={t('define.task.search.source')}
            options={triggerTypeArr()}
            onChange={value => searchParamsChange({ source: value })}
          ></Select>
          <Select
            allowClear={true}
            style={{ width: 258 }}
            placeholder={t('define.task.search.taskType')}
            options={taskTypeArr()}
            onChange={value => searchParamsChange({ taskType: value })}
          ></Select>
          <Search
            allowClear={true}
            placeholder={t('define.task.search.user')}
            onSearch={value => searchParamsChange({ user: value })}
            style={{ width: 296 }}
          />
        </Space>
      </span>
    </div>
  );

  return (
    <div className='deploy_history_title'>
      <Card
        headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }}
        bodyStyle={{ padding: 5 }}
        type={'inner'}
        title={title}
      >
        <Table
          columns={columns}
          scroll={{ x: 'min-content' }}
          loading={tableLoading}
          {...tableProps}
        />
      </Card>
    </div>
  );
};

export default Eb_WP()(memo(DeployHistory));
