
import React, { useState } from 'react';
import { Button, Modal, notification } from 'antd'; 
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
    title={`锁定环境 “${envInfo.name}”`}
    visible={true}
    onCancel={toggleVisible}
    okButtonProps={{
      loading: loading
    }}
    onOk={onOk}
    footer={<div>
      <Button key='back' onClick={toggleVisible}>
        取消
      </Button>
      {lockType !== 'lock' && <Button key='submit' type='primary' loading={clearLoading} onClick={() => onClear(true)}>
        清除定时销毁并解锁
      </Button>}
      <Button
        key='link'
        type='danger'
        loading={loading}
        onClick={() => {
          if (lockType === 'unlock') {
            onClear();
          } else {
            onOk(); 
          }
        }}
      >
        确定
      </Button>
    </div>}
  >
    {lockType === 'lock' ? <>
      <div >环境锁定后该环境将拒绝执行apply任务，包括『自动纠正漂移』、</div><br />
      <div>『定时销毁』、API触发的部署等任务，</div><br />
      <div>但漂移检测等plan类型任务可以照常执行。</div>
    </> :
      (<div className='dangerText'>
        <div >当前环境设置了定时销毁，并已过了定时销毁时间，解锁后将立即</div><br />
        <div>触发定时销毁任务，如不想销毁该环境，请选择</div><br />
        <div>『清除定时销毁并解锁』</div>
      </div>)}
  </Modal>;
};
