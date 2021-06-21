import React, { useEffect } from "react";
import {
  Radio,
  Form,
  Input,
  Button,
  InputNumber,
  Select,
  Space,
  Tooltip
} from "antd";

import { InfoIcon } from "components/common/localIcon";

const { Option } = Select;
const FL = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 }
};

export default (props) => {

  const { ctRunnerList, detailInfo, onFinish, submitLoading } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    const { defaultRunnerServiceId, ...otherDetailInfo } = detailInfo;
    form.setFieldsValue({ saveState: false, defaultRunnerServiceId: defaultRunnerServiceId || null, ...otherDetailInfo });
  }, [detailInfo]);

  const onFinishForm = (values) => {
    const { defaultRunnerServiceId = null, ...restValues } = values;
    const ctInfo = ctRunnerList.find((it) => it.ID == defaultRunnerServiceId) || {};
    const { Port = null, Address = null } = ctInfo;
    onFinish({
      ...restValues,
      defaultRunnerServiceId,
      defaultRunnerAddr: Address,
      defaultRunnerPort: Port
    });
  };

  return (
    <Form {...FL} layout='vertical' onFinish={onFinishForm} form={form}>
      <Form.Item
        label='云模板ID'
        name='guid'
        rules={[
          {
            required: true,
            message: "请输入"
          }
        ]}
      >
        <Input placeholder='请输入云模板ID' disabled={true} />
      </Form.Item>
      <Form.Item
        label='云模板名称'
        name='name'
        rules={[
          {
            required: true,
            message: "请输入"
          }
        ]}
      >
        <Input placeholder='请输入' />
      </Form.Item>
      <Form.Item
        label='保存状态'
        name='saveState'
        rules={[
          {
            required: true,
            message: "请选择"
          }
        ]}
      >
        <Radio.Group>
          <Radio value={false}>不保存</Radio>
          <Radio value={true}>
            保存
            <Tooltip
              placement='right'
              title='不保存状态在反复运行时的极大概率会出现资源名字/IP地址冲突，所以建议您选择保存状态'
            >
              <span>
                {" "}
                <InfoIcon />
              </span>
            </Tooltip>
          </Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label='运行超时' required={true}>
        <Space>
          <Form.Item
            name='timeout'
            rules={[
              {
                required: true,
                message: "请输入"
              }
            ]}
            style={{ display: "inline-block" }}
            noStyle={true}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item style={{ display: "inline-block" }} noStyle={true}>
            秒
          </Form.Item>
        </Space>
      </Form.Item>
      <Form.Item
        label='默认ct-runner'
        name='defaultRunnerServiceId'
      >
        <Select 
          getPopupContainer={triggerNode => triggerNode.parentNode} 
          placeholder='请选择ct-runner' 
          allowClear={true}
        >
          {ctRunnerList.map((it) => (
            <Option value={it.ID}>{it.Tags.join() || it.ID}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label='描述'
        name='description'
        rules={[
          {
            message: "请输入"
          }
        ]}
      >
        <Input.TextArea placeholder='请输入' />
      </Form.Item>
      <Form.Item>
        <Button
          disabled={detailInfo.status === "disable"}
          type='primary'
          htmlType='submit'
          loading={submitLoading}
        >
          更新信息
        </Button>
      </Form.Item>
    </Form>
  );
};
