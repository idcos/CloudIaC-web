import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button
} from "antd";

const FL = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 }
};

export default (props) => {

  const { detailInfo, onFinish, submitLoading } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ saveState: false, ...detailInfo });
  }, [detailInfo]);

  return (
    <Form {...FL} layout='vertical' onFinish={onFinish} form={form}>
      <Form.Item
        label='仓库地址'
        name='repoAddr'
        rules={[
          {
            required: true,
            message: "请输入"
          }
        ]}
      >
        <Input placeholder='请输入仓库地址' disabled={true} />
      </Form.Item>
      <Form.Item
        label='仓库分支'
        name='repoBranch'
        rules={[
          {
            required: true,
            message: "请输入"
          }
        ]}
      >
        <Input placeholder='请输入仓库分支' disabled={true} />
      </Form.Item>
      <Form.Item label='其他信息' noStyle={true}>
        <div className='tipZone'>
          <p className='reset-styles'>资源：</p>
          <p className='reset-styles'>版本：</p>
        </div>
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
