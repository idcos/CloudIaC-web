
import React, { useState } from 'react';
import { Button, Modal, Select } from 'antd'; 

const FL = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
};

export default ({ toggleVisible, lockType }) => {

  const [ loading, setLoading ] = useState(false);
  const [ clearLoading, setClearLoading ] = useState(false);
  
  const onOk = async () => {
    setLoading(true);
  };

  const onClear = async () => {
    setClearLoading(true);
  };

  return <Modal
    title={`警告`}
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
      {lockType !== 'lock' && <Button key='submit' type='primary' loading={clearLoading} onClick={onClear}>
        清除定时销毁并解锁
      </Button>}
      <Button
        key='link'
        type='danger'
        loading={loading}
        onClick={onOk}
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
