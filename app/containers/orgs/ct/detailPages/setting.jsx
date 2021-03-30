import React, { useState, useCallback } from 'react';
import { Card, Radio, Menu, Form, Input, Button, InputNumber, Alert } from "antd";

const subNavs = {
  basic: '基本信息',
  repo: '仓库信息',
  del: '删除云模板'
};

const FL = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 }
};

const Variable = (props) => {
  const [ panel, setPanel ] = useState('basic');

  const renderByPanel = useCallback(() => {
    const PAGES = {
      basic: <>
        <Form.Item
          label='云模板ID'
          name='ctId'
          rules={[
            {
              required: true,
              message: '请输入'
            }
          ]}
        >
          <Input placeholder='请输入云模板ID' />
        </Form.Item>
        <Form.Item
          label='云模板名称'
          name='ctName'
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
          name='save'
          rules={[
            {
              required: true,
              message: '请选择'
            }
          ]}
        >
          <Radio.Group>
            <Radio value='save'>不保存</Radio>
            <Radio value='notSave'>保存</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label='描述'
          name='des'
          rules={[
            {
              message: '请输入'
            }
          ]}
        >
          <Input.TextArea placeholder='请输入' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>更新信息</Button>
        </Form.Item>
      </>,
      repo: <>
        <Form.Item
          label='仓库地址'
          name='link'
          rules={[
            {
              required: true,
              message: '请输入'
            }
          ]}
        >
          <Input placeholder='请输入仓库地址' />
        </Form.Item>
        <Form.Item
          label='仓库分支'
          name='branch'
          rules={[
            {
              required: true,
              message: '请输入'
            }
          ]}
        >
          <Input placeholder='请输入仓库分支' />
        </Form.Item>
        <Form.Item
          label='运行超时'
          name='timeout'
          rules={[
            {
              required: true,
              message: '请输入'
            }
          ]}
        >
          <InputNumber /> 秒
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
          <Button type='primary' htmlType='submit'>更新信息</Button>
        </Form.Item>
      </>,
      del: <>
        <Alert
          message='删除云模板将删除所有作业、状态、变量、设置等记录，有问题请联系laC管理员'
          type='warning'
          showIcon={true}
          closable={true}
        />
        <br/>
        <Button type='primary' danger={true}>删除云模板</Button>
      </>
    };
    return PAGES[panel];
  }, [panel]);

  return <div className='setting'>
    <Menu
      mode='inline'
      className='subNav'
      defaultSelectedKeys={[panel]}
      onClick={({ item, key }) => setPanel(key)}
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
        >
          {renderByPanel()}
        </Form>
      </Card>
    </div>
  </div>;
};

export default Variable;
