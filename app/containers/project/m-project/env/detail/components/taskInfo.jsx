import React, { memo, useState, useEffect } from 'react';
import { Collapse, Descriptions, Tag, Tooltip, notification } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import { TASK_STATUS, TASK_STATUS_COLOR, TASK_TYPE } from 'constants/types';
import { Eb_WP } from 'components/error-boundary';
import ChangeInfo from 'components/change-info';
import { timeUtils } from "utils/time";
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import vcsAPI from 'services/vcs';
import tplAPI from 'services/tpl';
import { t } from 'utils/i18n';
import styles from '../styles.less';

const TaskInfo = (props) => {

  const { taskInfo = {} } = props;
  const [ urlMap, setUrlMap ] = useState({});

  useEffect(() => {
    if (taskInfo.id) {
      getUrlMap();
    }
  }, [taskInfo.id]);

  const getUrlMap = async () => {
    let data = {};
    const { orgId, tplId } = taskInfo || {};
    const tplDetail = await tplAPI.detail({ orgId, tplId });
    if (tplDetail.code !== 200) {
      return notification.error({ message: tplDetail.message });
    }
    const { repoId, vcsId } = tplDetail.result || {};
    await linkToPage({ commitId: taskInfo.commitId, repoId, vcsId }).then((commitUrl) => {
      data.commitUrl = commitUrl;
      setUrlMap(data);
    });
  };

  // 跳转repo页面
  const { run: linkToPage } = useRequest(
    (params) => requestWrapper(
      vcsAPI.getReposUrl.bind(null, {
        repoRevision: taskInfo.revision,
        ...params
      })
    ),
    {
      manual: true
    }
  );


  return (
    <Collapse expandIconPosition={'right'} forceRender={true}>
      <Collapse.Panel header='作业详情'>
        <Descriptions
          labelStyle={{ color: '#24292F' }}
          contentStyle={{ color: '#57606A' }}
        >
          <Descriptions.Item label={t('define.status')}>
            {
              TASK_STATUS[taskInfo.status] ? (
                <Tag color={TASK_STATUS_COLOR[taskInfo.status] || 'default'}>{TASK_STATUS[taskInfo.status]}</Tag>
              ) : '-'
            }
            {
              taskInfo.status === 'failed' && taskInfo.message ? (
                <Tooltip title={taskInfo.message}>
                  <InfoCircleFilled style={{ color: '#ff4d4f' }} />
                </Tooltip>
              ) : null
            }
          </Descriptions.Item>
          <Descriptions.Item label={t('define.type')}>{TASK_TYPE[taskInfo.type] || '-'}</Descriptions.Item>
          <Descriptions.Item label={`${t('define.branch')}/${t('define.tag')}`}>{taskInfo.revision || '-'}</Descriptions.Item>
          <Descriptions.Item label='Commit ID'><span onClick={() => {
            // window.open(`${taskInfo.repoAddr.replace('.git', '')}/commit/${taskInfo.commitId}`);
            window.open(urlMap.commitUrl);
          }} className={styles.linkToPage}
          >{taskInfo.commitId && taskInfo.commitId.substring(0, 12) || '-'}</span></Descriptions.Item>
          <Descriptions.Item label={t('define.updateTime')}>{timeUtils.format(taskInfo.updatedAt) || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('define.createdAt')}>{timeUtils.format(taskInfo.createdAt) || '-'}</Descriptions.Item>
          <Descriptions.Item label='开始时间'>{timeUtils.format(taskInfo.startAt) || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('define.task.field.duration')}>{timeUtils.diff(taskInfo.endAt, taskInfo.startAt) || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('define.task.field.creator')}>{taskInfo.creator || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('define.task.field.result')}><ChangeInfo {...taskInfo.result} /></Descriptions.Item>
          <Descriptions.Item label='target'>{taskInfo.targets}</Descriptions.Item>
        </Descriptions>
      </Collapse.Panel>
    </Collapse>
  );
};

export default Eb_WP()(memo(TaskInfo));
