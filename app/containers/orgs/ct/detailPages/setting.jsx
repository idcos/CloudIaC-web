import React, { useState, useCallback, useContext, useEffect } from 'react';
import { Card, Radio, Menu, Form, Input, Button, InputNumber, Divider, notification, Space } from "antd";

import { ctAPI } from 'services/base';

const subNavs = {
  basic: '基本信息',
  repo: '仓库信息',
  del: '操作权限'
};

const FL = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 }
};

const Setting = (props) => {

  const { routesParams, location } = props;
  const { curOrg, ctId, detailInfo, reload } = routesParams;
  const { initSettingPanel } = location.state || {};
  const [ panel, setPanel ] = useState(initSettingPanel || 'basic');
  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setSubmitLoading(true);
      const res = await ctAPI.edit({
        ...values,
        orgId: curOrg.id,
        id: ctId - 0
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setSubmitLoading(false);
      notification.success({
        message: '操作成功'
      });
      reload();
    } catch (e) {
      setSubmitLoading(false);
      notification.error({
        message: e.message
      });
    }
  };

  const delCT = async () => {
    try {
      const res = await ctAPI.delCT({
        orgId: curOrg.id,
        id: ctId - 0
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: '操作成功'
      });
    } catch (e) {
      notification.error({
        message: e.message
      });
    }
  };

  useEffect(() => {
    form.setFieldsValue({ saveState: false, ...detailInfo });
  }, [detailInfo]);

  const renderByPanel = useCallback(() => {
    const PAGES = {
      basic: <>
        <Form.Item
          label='云模板ID'
          name='guid'
          rules={[
            {
              required: true,
              message: '请输入'
            }
          ]}
        >
          <Input placeholder='请输入云模板ID' disabled={true}/>
        </Form.Item>
        <Form.Item
          label='云模板名称'
          name='name'
          rules={[
            {
              required: true,
              message: '请输入'
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
              message: '请选择'
            }
          ]}
        >
          <Radio.Group>
            <Radio value={false}>不保存</Radio>
            <Radio value={true}>保存</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label='描述'
          name='description'
          rules={[
            {
              message: '请输入'
            }
          ]}
        >
          <Input.TextArea placeholder='请输入' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' loading={submitLoading}>更新信息</Button>
        </Form.Item>
      </>,
      repo: <>
        <Form.Item
          label='仓库地址'
          name='repoAddr'
          rules={[
            {
              required: true,
              message: '请输入'
            }
          ]}
        >
          <Input placeholder='请输入仓库地址' disabled={true}/>
        </Form.Item>
        <Form.Item
          label='仓库分支'
          name='repoBranch'
          rules={[
            {
              required: true,
              message: '请输入'
            }
          ]}
        >
          <Input placeholder='请输入仓库分支' disabled={true}/>
        </Form.Item>
        <Form.Item label='运行超时' required={true}>
          <Space>
            <Form.Item
              name='timeout'
              rules={[
                {
                  required: true,
                  message: '请输入'
                }
              ]}
              style={{ display: 'inline-block' }}
              noStyle={true}
            >
              <InputNumber min={0}/>
            </Form.Item>
            <Form.Item
              style={{ display: 'inline-block' }}
              noStyle={true}
            >
              秒
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item
          label='其他信息'
          noStyle={true}
        >
          <div className='tipZone'>
            <p>资源：</p>
            <p>版本：</p>
          </div>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' loading={submitLoading}>更新信息</Button>
        </Form.Item>
      </>,
      del: <>
        {
          detailInfo.status == 'disable' ? <>
            <Button
              type='primary'
              onClick={() => onFinish({ status: 'enable' })}
            >
              启用云模板
            </Button>
            <p className='tipText'>启用云模板后所有功能都可正常操作(发起作业、变量修改、设置修改等</p>
          </> : <>
            <Button
              type='primary'
              danger={true}
              onClick={() => onFinish({ status: 'disable' })}
            >
              禁用云模板
            </Button>
            <p className='tipText'>禁用云模板后所有操作(发起作业、修改变量等)都将禁用，仅能够正常访问云模板数据</p>
          </>
        }
        {/* <Divider/>
        <Button type='primary' danger={true} onClick={delCT}>删除云模板</Button>
        <p className='tipText'>删除云模板将删除所有作业、状态、变量、设置等记录，请谨慎操作</p> */}
      </>
    };
    return PAGES[panel];
  }, [ panel, detailInfo ]);

  return <div className='setting'>
    <Menu
      mode='inline'
      className='subNav'
      selectedKeys={[panel]}
      onClick={({ item, key }) => {
        setPanel(key);
      }}
    >
      {Object.keys(subNavs).map(it => <Menu.Item key={it}>{subNavs[it]}</Menu.Item>)}
    </Menu>
    <div className='rightPanel'>
      <Card
        title={subNavs[panel]}
      >
        <Form
          {...FL}
          layout='vertical'
          onFinish={onFinish}
          form={form}
        >
          {renderByPanel()}
        </Form>
      </Card>
    </div>
  </div>;
};

export default Setting;
