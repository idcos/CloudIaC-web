import React, { useState, useEffect } from 'react';
import { Card, List, notification, Empty } from 'antd';
import CoderCard from 'components/coder/coder-card';
import { ctAPI } from 'services/base';
import RunningTaskItem from './components/runningTaskItem/index';
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
      <div className='List fn-mb-24'>
        <Card>
          <div className='tableRender'>
            <List
              itemLayout='horizontal'
              dataSource={[taskInfo]}
              renderItem={(item, index) => <RunningTaskItem index={index} item={item} linkToRunningDetail={linkToRunningDetail} ctRunnerList={ctRunnerList} />}
            />
          </div>
        </Card>
      </div>
      <CoderCard mode='application/json' value={stateFileStr} coderHeight={400} />
      <Card title='Terraform state list' style={{ marginTop: 24 }}>
        {
          detailInfo.playbook ? detailInfo.playbook : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )
        }
      </Card>
    </div>
  );
};

export default State;
