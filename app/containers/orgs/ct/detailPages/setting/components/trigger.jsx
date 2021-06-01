import React, { useState } from "react";
import { Card, Button, Space } from "antd";
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';

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
            <CopyOutlined style={{ color: '#13C2C2' }} />
            <DeleteOutlined onClick={() => op('del')} style={{ color: '#F44336' }} />
          </Space>
        ) : (
          <div className='fn-TA-C'>
            <span className='fn-descriptions-color'>暂无数据{' '}</span>
            <a onClick={() => op('create')}>现在创建</a>
          </div>
        )
      }
    </Card>
  );
};