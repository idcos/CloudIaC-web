import React, { useImperativeHandle, useEffect } from 'react';
import { Space, Form, Input, Button, Switch, Alert, Select, Checkbox } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import cgroupsAPI from 'services/cgroups';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 }
};

export default ({ onlineCheckForm, goCTlist, opType, childRef, stepHelper, ctData, type, saveLoading }) => {

  const [form] = Form.useForm();

  useImperativeHandle(childRef, () => ({
    onFinish: async (index) => {
      const values = await form.validateFields();
      await onlineCheckForm(values);
      stepHelper.updateData({
        type, 
        data: values
      });
      stepHelper.go(index);
    }
  }));

  // 策略组选项列表查询
  const { data: policiesGroupOptions = [] } = useRequest(
    () => requestWrapper(
      cgroupsAPI.list.bind(null, { pageSize: 0 }),
      {
        formatDataFn: (res) => ((res.result || {}).list || []).map(({ name, id }) => ({ label: name, value: id }))
      }
    )
  );

  const onFinish = async (values) => {
    await onlineCheckForm(values);
    stepHelper.updateData({
      type, 
      data: values,
      isSubmit: opType === 'edit'
    });
    opType === 'add' && stepHelper.next();
  };

  useEffect(() => {
    if (ctData[type]) {
      form.setFieldsValue(ctData[type]);
    }
  }, [ ctData, type ]);

  return <div className='form-wrapper' style={{ width: 600 }}>
    <Form
      form={form}
      {...FL}
      onFinish={onFinish}
    >
      <Form.Item
        label='模板名称'
        name='name'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input style={{ width: 254 }} placeholder='请输入模板名称' />
      </Form.Item>
      <Form.Item
        label='模板描述'
        name='description'
      >
        <Input.TextArea placeholder='请输入模板描述' rows={7} />
      </Form.Item>
      <Form.Item
        label='开启合规检测'
        name='policyEnable'
        valuePropName='checked'
      >
        <Switch />
      </Form.Item>
      <Form.Item
        noStyle={true}
        shouldUpdate={true}
      >
        {({ getFieldValue }) => {
          const policyEnable = getFieldValue('policyEnable');
          return policyEnable ? (
            <>
              <Alert
                message='云模板开启合规检测后，该云模板部署的新环境默认将开启合规检测，并应用绑定的策略组环境创建后如需修改策略组可在『合规中心』或『环境详情』-『设置』中进行配置'
                type='info'
                showIcon={true}
                icon={<InfoCircleOutlined style={{ color: '#166CC1' }} />}
                style={{ margin: '-16px 0 16px', backgroundColor: '#e9f3fc', borderColor: '#e9f3fc' }}
              />
              <Form.Item
                label='绑定策略组'
                name='policyGroup'
                rules={[{ required: true, message: '请选择' }]}
              >
                <Select 
                  mode='multiple'
                  optionFilterProp='label'
                  showArrow={true}
                  showSearch={true}
                  options={policiesGroupOptions}
                  placeholder='请选择策略组'
                />
              </Form.Item>
              <Form.Item
                name='tplTriggers'
                wrapperCol={{ offset: 5, span: 14 }}
                className='ant-form-item-no-min-height'
              >
                <Checkbox.Group>
                  <Checkbox value='commit'>分支推送时自动检测合规</Checkbox>                  
                </Checkbox.Group>
              </Form.Item>
            </>
          ) : null;
        }}
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 5, span: 14 }} style={{ paddingTop: 24, marginBottom: 0 }}>
        <Space size={24}>
          {
            opType === 'add' ? (
              <>
                <Button className='ant-btn-tertiary' onClick={() => stepHelper.prev()}>上一步</Button>
                <Button type='primary' htmlType={'submit'}>下一步</Button>
              </>
            ) : (
              <>
                <Button className='ant-btn-tertiary' onClick={goCTlist}>取消</Button>
                <Button type='primary' htmlType={'submit'} loading={saveLoading}>提交</Button>
              </>
            )
          }
        </Space>
      </Form.Item>
    </Form>
  </div>;
};
