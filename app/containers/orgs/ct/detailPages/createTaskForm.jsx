import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, notification, Select, Space, Button } from 'antd';
import { sysAPI } from 'services/base';
import { ctAPI } from 'services/base';


const { Option } = Select;
const FL = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};

export default ({ closePopover, taskType, orgId, ctDetailInfo, linkToRunningDetail }) => {
  const [ ctRunnerList, setCtRunnerList ] = useState([]);

  useEffect(() => {
    fetchCTRunner();
  }, []);

  const fetchCTRunner = async () => {
    try {
      const res = await sysAPI.listCTRunner({ orgId });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setCtRunnerList(res.result || []);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const onFinish = async (values) => {
    try {
      const { ctServiceId, ...restValues } = values;
      const ctInfo = ctRunnerList.find(it => it.ID == ctServiceId);
      if (!ctInfo) {
        throw new Error('获取CT Runner失败');
      }
      const { Port, Address } = ctInfo;
      const res = await ctAPI.createTask({
        taskType,
        orgId,
        ctServiceId,
        ...restValues,
        templateId: ctDetailInfo.id,
        templateGuid: ctDetailInfo.guid,
        ctServiceIp: Address,
        ctServicePort: Port
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      closePopover();
      notification.success({
        message: '操作成功'
      });
      linkToRunningDetail(res.result && res.result.id);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  return <Form
    {...FL}
    onFinish={onFinish}
  >
    <Form.Item
      label='描述'
      name='name'
      rules={[
        {
          message: '请输入'
        }
      ]}
    >
      <Input placeholder='请输入作业名称'/>
    </Form.Item>
    <Form.Item
      label='CT Runner'
      name='ctServiceId'
      rules={[
        {
          required: true,
          message: '请选择'
        }
      ]}
    >
      <Select placeholder='请选择'>
        {ctRunnerList.map(it => <Option value={it.ID}>{it.Service}</Option>)}
      </Select>
    </Form.Item>
    <div
      style={{ textAlign: 'right ' }}
    >
      <Space>
        <Button onClick={closePopover}>取消</Button>
        <Button type='primary' htmlType='submit'>确定</Button>
      </Space>
    </div>
  </Form>;
};
