import React, { useState, useEffect } from 'react';
import { Card, Divider, List, notification, Space } from 'antd';
import moment from 'moment';
import Coder from 'components/coder';
import { CT } from 'constants/types';

import { ctAPI } from 'services/base';
import { timeUtils } from 'utils/time';


const data = [
  {
    title: 'Ant Design Title 1',
    id: 'org1'
  }
];

const State = ({ curOrg, detailInfo }) => {
  const [ stateFileStr, setStateFileStr ] = useState('');

  useEffect(() => {
    fetchCode();
  }, []);

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

  return <div className='state'>
    <Card>
      <div className='tableRender'>
        <List
          itemLayout='horizontal'
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={<h2>{item.name || '-'}{item.commitId}</h2>}
                description={
                  <Space split={<Divider type='vertical' />}>
                    <span>{item.guid}</span>
                    <span>{CT.taskType[item.taskType]}</span>
                    <span>{item.ctServiceId}</span>
                  </Space>
                }
              />
              <div className='list-content'>
                <span className={`status-text`}>{CT.taskStatusIcon[item.status]} {CT.taskStatus[item.status]}</span>
                <p>{timeUtils.format(item.updatedAt)}</p>
              </div>
            </List.Item>
          )}
        />
      </div>
    </Card>
    <Card style={{ marginTop: 16 }}>
      <Coder value={stateFileStr} onChange={() => ''}/>
    </Card>
  </div>;
};

export default State;
