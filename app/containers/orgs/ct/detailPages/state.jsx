import React, { useState, useEffect } from 'react';
import { Card, List, notification, Empty } from 'antd';
import CoderCard from 'components/coder/coder-card';
import Coder from "components/coder";
import { ctAPI } from 'services/base';
import RunningTaskItem from './components/runningTaskItem/index';
import isEmpty from 'lodash/isEmpty';

const State = ({ routesParams: { curOrg, detailInfo, linkToRunningDetail, ctRunnerList } }) => {
  const [ stateFileStr, setStateFileStr ] = useState('');
  const [ taskInfo, setTaskInfo ] = useState({});
  const [ stateList, setStateList ] = useState([]);

  useEffect(() => {
    if (!isEmpty(detailInfo)) {
      fetchCode();
      fetchTaskInfo();
    }
  }, [detailInfo]);

  useEffect(() => {
    if (taskInfo.guid) {
      fetchState();
    }
  }, [taskInfo]);

  const fetchState = async () => {
    try {
      const res = await ctAPI.stateSearch({
        orgId: curOrg.id,
        taskGuid: taskInfo.guid
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      console.log(res);
      setStateList(res.result || []);
    } catch (e) {
      notification.error({
        message: e.message
      });
    }
  };
  
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
      <Card className='card-body-no-paading' title='Terraform state list' style={{ marginTop: 24 }}>
        {
          stateList.length > 0 ? (
            <Coder options={{ mode: '' }} value={stateList.join('\n')} style={{ height: 'auto' }} />
          ) : ( 
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )
        }
      </Card>
    </div>
  );
};

export default State;
