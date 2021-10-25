import React, { useState, useEffect, useRef } from "react";
import { Card, notification, List, Button, Input, Row, Tag, Spin, Tooltip, Collapse } from "antd";
import { InfoCircleFilled } from '@ant-design/icons';
import { connect } from "react-redux";
import { useRequest, useEventEmitter } from 'ahooks';
import { requestWrapper } from 'utils/request';
import getPermission from "utils/permission";
import { TASK_STATUS, TASK_STATUS_COLOR, TASK_TYPE } from 'constants/types';
import envAPI from 'services/env';
import taskAPI from 'services/task';
import history from 'utils/history';
import { timeUtils } from "utils/time";
import { useEventSource } from "utils/hooks";
import styles from './styles.less';

const { Panel } = Collapse;

export default ({ taskInfo, taskId }) => {

  // 列表查询
  const {
    loading: tableLoading,
    data: tableData,
    run: fetchList
  } = useRequest(
    (params) => requestWrapper(
      orgsAPI.listResources.bind(null, { orgId, ...params })
    )
  );


  return (
    <Card
      bodyStyle={{ background: 'rgba(36, 38, 35)', padding: 0 }}
      title={
        <div className={styles.card_title}>
          <div className={styles.card_title_top}>
            <span className={styles.title}>部署日志</span> 
            <Tag className={styles.status} color={TASK_STATUS_COLOR[taskInfo.status] || 'default'}>{TASK_STATUS[taskInfo.status]}</Tag>
          </div>
          <div className={styles.card_title_bottom}>执行总耗时：-</div>
        </div>
      }
    >
      <Collapse ghost={true} className={styles.deploy_log_collapse}>
        <Panel header="This is panel header 1" key="1" forceRender={true}>
          <p>1</p>
        </Panel>
        <Panel header="This is panel header 2" key="2" forceRender={true}>
          <p>2</p>
        </Panel>
        <Panel header="This is panel header 3" key="3" forceRender={true}>
          <p>3</p>
        </Panel>
      </Collapse>
    </Card>
  );
};
