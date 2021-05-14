import React, { useState, useEffect } from 'react';
import { Card, Divider, List, notification, Space, Button } from 'antd';
import Coder from 'components/coder';
import { CT } from 'constants/types';
import { ctAPI } from 'services/base';
import RunningTaskItem from './components/runningTaskItem';
import {
  FullscreenExitOutlined, FullscreenOutlined
} from '@ant-design/icons';
import { statusTextCls } from 'utils/util';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';

const State = ({ routesParams: { curOrg, detailInfo, linkToRunningDetail, ctRunnerList } }) => {
  const [ stateFileStr, setStateFileStr ] = useState('');
  const [ taskInfo, setTaskInfo ] = useState({});
  const [ fullScreen, setFullScreen ] = useState(false);

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
      <Card
        className={`card-body-no-paading ${fullScreen ? 'full-card' : ''}`}
        style={{ marginTop: 16 }}
        extra={
          <Space>
            <Button onClick={() => setFullScreen(!fullScreen)}>
              {fullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
              全屏显示
            </Button>
          </Space>
        }
      >
        <Coder
          selfClassName='card-coder'
          value={stateFileStr}
          onChange={() => ""}
        />
      </Card>
    </div>
  );
};

export default State;
