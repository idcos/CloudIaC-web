import React, { useState } from "react";
import { Card, notification, Space } from "antd";
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import copy from 'utils/copy';

export default () => {

  const [ planActionUrl, setPlanActionUrl ] = useState('');
  const [ applyActionUrl, setApplyActionUrl ] = useState('');

  const op = (actionType, opType) => {
    switch (actionType) {
      case 'plan':
        setPlanActionUrl(
          opType === 'create' ? 'http://iac.idcos.net/template/hook/plan?access_token-8011999911de06aa102' : ''
        );
        break;
      case 'apply':
        setApplyActionUrl(
          opType === 'create' ? 'http://iac.idcos.net/template/hook/apply?access_token-8011999911de06aa102' : ''
        );
        break;
      default:
        break;
    }
  };

  return (
    <>
      <ActionCard title='plan动作' actionUrl={planActionUrl} op={(opType) => op('plan', opType)} />
      <ActionCard title='apply动作' actionUrl={applyActionUrl} op={(opType) => op('apply', opType)} cardStyle={{ marginTop: 24 }} />
    </>
  );
};

const ActionCard = (props) => {
  const { title, actionUrl, op, cardStyle } = props;
 
  return (
    <Card
      type='inner'
      title={title}
      style={cardStyle}
    > 
      {
        actionUrl ? (
          <Space>
            <span>{actionUrl}</span>
            <CopyOutlined className='fn-color-primary' onClick={() => copy(actionUrl)}/>
            <DeleteOutlined className='fn-color-destroy' onClick={() => op('del')} />
          </Space>
        ) : (
          <div className='fn-TA-C'>
            <span className='fn-color-gray-6'>暂无数据{' '}</span>
            <a onClick={() => op('create')}>现在创建</a>
          </div>
        )
      }
    </Card>
  );
};