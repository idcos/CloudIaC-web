import React, { useState, useEffect, useMemo } from "react";
import { Card, notification, Space } from "antd";
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';

import copy from 'utils/copy';
import { ctAPI } from "services/base";

export default (props) => {

  const { ctId, orgId } = props;

  const [ webhookList, setWebhookList ] = useState([]);

  useEffect(() => {
    if (ctId) {
      getWebhook();
    }
  }, [ctId]);

  const getWebhook = async () => {
    const res = await ctAPI.webhookSearch({
      orgId, 
      tplGuid: ctId
    });
    const { list } = res.result || {};
    setWebhookList(list || []);
  };

  const webhooks = useMemo(() => {
    const planWebhook = (webhookList || []).find((it) => it.action === 'plan');
    const applyWebhook = (webhookList || []).find((it) => it.action === 'apply');
    return {
      plan: planWebhook,
      apply: applyWebhook
    };
  }, [webhookList]);

  return (
    <>
      <ActionCard 
        actionType='plan'
        webhook={webhooks.plan} 
        orgId={orgId} 
        ctId={ctId} 
        reload={getWebhook} 
      />
      <ActionCard 
        actionType='apply'
        webhook={webhooks.apply} 
        cardStyle={{ marginTop: 24 }} 
        orgId={orgId} 
        ctId={ctId}
        reload={getWebhook}
      />
    </>
  );
};

const ActionCard = (props) => {
  const { actionType, webhook, cardStyle, orgId, ctId, reload } = props;
  const { accessToken, id } = webhook || {};

  const url = `${location.origin}/template/hook/send?accessToken=${accessToken}`;

  const creat = async () => {
    const res = await ctAPI.webhookCreate({
      orgId, 
      tplGuid: ctId,
      action: actionType
    });
    reload();
  };

  const del = async () => {
    const res = await ctAPI.webhookDelete({
      orgId, 
      id
    });
    reload();
  };
 
  return (
    <Card
      type='inner'
      title={actionType + '动作'}
      style={cardStyle}
    > 
      {
        webhook ? (
          <Space>
            <span>{url}</span>
            <CopyOutlined className='fn-color-primary' onClick={() => copy(url)}/>
            <DeleteOutlined className='fn-color-destroy' onClick={() => del()} />
          </Space>
        ) : (
          <div className='fn-TA-C'>
            <span className='fn-color-gray-6'>暂无数据{' '}</span>
            <a onClick={() => creat()}>现在创建</a>
          </div>
        )
      }
    </Card>
  );
};