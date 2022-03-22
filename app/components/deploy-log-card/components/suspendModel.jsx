
import React, { useState } from 'react';
import { Form, Input, Modal, Select } from 'antd'; 

const FL = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
};

export default ({ toggleVisible, envInfo, taskInfo }) => {

  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [form] = Form.useForm();
  
  const onOk = async () => {
    setSubmitLoading(true);
  };

  return <Modal
    title={`警告`}
    visible={true}
    onCancel={toggleVisible}
    okButtonProps={{
      loading: submitLoading
    }}
    onOk={onOk}
  >
    <span>{`当前环境【${envInfo.name}】`}</span><br/>
    <span >中止执行中的任务存在如下风险：</span>
    <p className='dangerText'>
      在apply动作开始后中止任务，环境状态将标记为【失败】, <br/>
      并有可能损坏环境的状态文件，导致该环境损坏，<br/>
      请在了解可能带来的风险前提下执行该动作。<br/>
    </p>
    <Form
      {...FL}
      form={form}
    >
      <Form.Item
        label='输入环境名称确认中止'
        name='todoform'
        rules={[{
          required: true,
          message: '请确认环境名称'
        }, {
          validator: async (rule, value) => {
            if (value !== envInfo.name) {
              throw new Error('当前环境输入不一致');
            }
          }
        }]}
      >
        <Input />
      </Form.Item>
    </Form>
  </Modal>;
};
