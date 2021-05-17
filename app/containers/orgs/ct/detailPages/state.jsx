import React, { useState, useEffect } from 'react';
import { Card, List, notification } from 'antd';
import CoderCard from 'components/coder/coder-card';
import { ctAPI } from 'services/base';
import RunningTaskItem from './components/runningTaskItem';
import isEmpty from 'lodash/isEmpty';

const State = ({ routesParams: { curOrg, detailInfo, linkToRunningDetail, ctRunnerList } }) => {
  const [ stateFileStr, setStateFileStr ] = useState('');
  const [ taskInfo, setTaskInfo ] = useState({});

  useEffect(() => {
    if (!isEmpty(detailInfo)) {
      fetchCode();
      fetchTaskInfo();
    }
  }, [detailInfo]);

  const fetchCode = async () => {
    try {
      const res = await ctAPI.stateFile({
        orgId: curOrg.id,
        filePath: `${curOrg.guid}/${detailInfo.guid}.tfstate`
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setStateFileStr(res.result || '');
    } catch (e) {
      notification.error({
        message: e.message
      });
    }
  };

  const fetchTaskInfo = async () => {
    try {
      const res = await ctAPI.latestTask({
        orgId: curOrg.id,
        templateId: detailInfo.id
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setTaskInfo(res.result || {});
    } catch (e) {
      notification.error({
        message: e.message
      });
    }
  };

  return (
    <div className='state'>
      <div className='List'>
        <Card>
          <div className='tableRender'>
            <List
              itemLayout='horizontal'
              dataSource={[taskInfo]}
              renderItem={(item) => <RunningTaskItem item={item} linkToRunningDetail={linkToRunningDetail} ctRunnerList={ctRunnerList} />}
            />
          </div>
        </Card>
      </div>
      <CoderCard mode='application/json' value={stateFileStr} cardStyle={{ marginTop: 16 }} />
    </div>
  );
};

export default State;
