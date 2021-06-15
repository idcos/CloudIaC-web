import React, { useState, useEffect, useMemo } from "react";
import { Card, notification, Space, Spin } from "antd";
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';

import copy from 'utils/copy';
import { ctAPI } from "services/base";

export default (props) => {

  const { orgId, detailInfo = {} } = props;
  const ctGuid = detailInfo.guid;
  const disabled = detailInfo.status === 'disable';

  const [ webhookList, setWebhookList ] = useState([]);
  const [ spinning, setSpinning ] = useState(false);

  useEffect(() => {
    if (ctGuid) {
      getWebhook();
    }
  }, [ctGuid]);

  const getWebhook = async () => {
    setSpinning(true);
    const res = await ctAPI.webhookSearch({
      orgId, 
      tplGuid: ctGuid
    });
    setSpinning(false);
    if (res.code !== 200) {
      notification.error({
        message: '获取失败',
        description: res.message
      });
      return;
    }
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
    <Spin spinning={spinning}>
      <ActionCard 
        actionType='plan'
        webhook={webhooks.plan} 
        orgId={orgId} 
        ctGuid={ctGuid} 
        reload={getWebhook} 
        setSpinning={setSpinning}
        disabled={disabled}
      />
      <ActionCard 
        actionType='apply'
        webhook={webhooks.apply} 
        cardStyle={{ marginTop: 24 }} 
        orgId={orgId} 
        ctGuid={ctGuid}
        reload={getWebhook}
        setSpinning={setSpinning}
        disabled={disabled}
      />
    </Spin>
  );
};

const ActionCard = (props) => {
  const { actionType, webhook, cardStyle, orgId, ctGuid, reload, setSpinning, disabled } = props;
  const { accessToken, id } = webhook || {};

  const url = `${location.origin}/template/hook/send?accessToken=${accessToken}`;

  const creat = async () => {
    setSpinning(true);
    const res = await ctAPI.webhookCreate({
      orgId, 
      tplGuid: ctGuid,
      action: actionType
    });
    setSpinning(false);
    if (res.code !== 200) {
      notification.error({
        message: '创建失败',
        description: res.message
      });
      return;
    }
    notification.success({
      message: '创建成功'
    });
    reload();
  };

  const del = async () => {
    setSpinning(true);
    const res = await ctAPI.webhookDelete({
      orgId, 
      id
    });
    setSpinning(false);
    if (res.code !== 200) {
      notification.error({
        message: '删除失败',
        description: res.message
      });
      return;
    }
    notification.success({
      message: '删除成功'
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
            <a disabled={disabled}>
              <DeleteOutlined className={`fn-color-destroy ${disabled ? 'fn-disabled-link' : ''}`} onClick={() => del()} />
            </a>
          </Space>
        ) : (
          <div className='fn-TA-C'>
            <span className='fn-color-gray-6'>暂无数据{' '}</span>
            {
              disabled ? null : <a onClick={() => creat()}>现在创建</a>
            }
          </div>
        )
      }
    </Card>
  );
};