
import React, { useState } from 'react';
import { Button, Modal, notification, Space } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import envAPI from 'services/env';

const FL = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
};

export default ({ toggleVisible, lockType, reload, envInfo, orgId, projectId, envId }) => {
  const [ loading, setLoading ] = useState(false);
  const [ clearLoading, setClearLoading ] = useState(false);

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

  const onClear = async (value) => {
    setClearLoading(true);
    let params = {
      orgId, projectId, envId
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

  return <Modal
    closable={false}
    title={<span><InfoCircleFilled style={{ color: '#f00', marginRight: 8 }} /><span style={{ color: 'rgba(36, 41, 47, 100)' }}>{`锁定环境 “${envInfo.name}”`}</span></span>}
    visible={true}
    getContainer={false}
    onOk={onOk}
    bodyStyle={{ marginLeft: 32 }}
    footer={
      <Space>
        <Button key='back' className='ant-btn-tertiary' onClick={toggleVisible}>
          取消
        </Button>
        {lockType !== 'lock' && <Button key='submit' loading={clearLoading} onClick={() => onClear(true)}>
          取消定时销毁且解锁
        </Button>}
        <Button
          key='link'
          type='primary'
          loading={loading}
          onClick={() => {
            if (lockType === 'unlock') {
              onClear();
            } else {
              onOk();
            }
          }}
        >
          确认锁定
        </Button>
      </Space>
    }
  >
    {lockType === 'lock' ? (
      <div style={{ color: 'rgba(87, 96, 106, 100)' }}>
        环境锁定后该环境将拒绝执行apply任务，包括『自动纠正漂移』、『定时销毁』、API触发的部署等任务，但漂移检测等plan类型任务可以照常执行。
      </div>
    ) : (
      <div style={{ color: 'rgba(87, 96, 106, 100)' }}>
        <div >当前环境设置了定时销毁，并已过了定时销毁时间，解锁后将立即<br />
          触发定时销毁任务，如不想销毁该环境，请选择<br />
          『清除定时销毁并解锁』</div>
      </div>
    )}
  </Modal>;
};
