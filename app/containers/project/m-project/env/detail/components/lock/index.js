import React, { useState } from 'react';
import { Button, Modal, notification, Space } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import envAPI from 'services/env';
import { t } from 'utils/i18n';

const Lock = ({
  toggleVisible,
  lockType,
  reload,
  envInfo,
  orgId,
  projectId,
  envId,
}) => {
  const [loading, setLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);

  const onOk = async () => {
    setLoading(true);
    let res = await envAPI.envLocked({ orgId, projectId, envId });
    setLoading(false);

    if (res.code !== 200) {
      return notification.error({ message: res.message });
    }

    toggleVisible();
    reload();
  };

  const onClear = async value => {
    setClearLoading(true);
    let params = {
      orgId,
      projectId,
      envId,
    };
    if (value) {
      params.clearDestroyAt = true;
    }
    let res = await envAPI.envUnLocked({ ...params });
    setClearLoading(false);

    if (res.code !== 200) {
      return notification.error({ message: res.message });
    }

    toggleVisible();
    reload();
  };

  return (
    <Modal
      closable={false}
      title={
        <span>
          <InfoCircleFilled
            style={{ color: '#DD2B0E', marginRight: 8, fontSize: 21 }}
          />
          <span style={{ color: 'rgba(36, 41, 47, 100)' }}>{`${
            lockType === 'lock'
              ? t('define.env.action.lock')
              : t('define.env.action.unlock')
          } “${envInfo.name && envInfo.name.replace(' ', '\u00A0')}”`}</span>
        </span>
      }
      visible={true}
      getContainer={false}
      onOk={onOk}
      bodyStyle={{ marginLeft: 32 }}
      footer={
        <Space>
          <Button
            key='back'
            className='ant-btn-tertiary'
            onClick={toggleVisible}
          >
            {t('define.ct.import.action.cancel')}
          </Button>
          {lockType !== 'lock' && (
            <Button
              danger={true}
              key='submit'
              loading={clearLoading}
              onClick={() => onClear()}
            >
              {t('define.env.action.unlock.confirm.action.cancelTiming')}
            </Button>
          )}
          <Button
            key='link'
            type='primary'
            loading={loading}
            onClick={() => {
              if (lockType === 'unlock') {
                onClear(true);
              } else {
                onOk();
              }
            }}
          >
            {lockType === 'lock'
              ? t('define.env.action.lock.confirm.action.confirmLock')
              : t('define.env.action.unlock.confirm.action.confirmLock')}
          </Button>
        </Space>
      }
    >
      {lockType === 'lock' ? (
        <div style={{ color: 'rgba(87, 96, 106, 100)' }}>
          {t('define.env.action.lock.des')}
        </div>
      ) : (
        <div style={{ color: 'rgba(87, 96, 106, 100)' }}>
          {t('define.env.action.unlock.des')}
        </div>
      )}
    </Modal>
  );
};

export default Lock;
