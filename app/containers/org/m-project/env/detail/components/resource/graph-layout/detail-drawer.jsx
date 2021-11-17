import React from 'react';
import { Drawer, Form, Input } from 'antd';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import envAPI from 'services/env';
import FormCoder from 'components/coder/form-coder';
import { safeJsonStringify } from 'utils/util';

export default ({ visible, id, onClose, orgId, projectId, envId, type }) => {
  
  const { data = {}, loading } = useRequest(
    () => {
      const resourcesApis = {
        env: envAPI.getResourcesGraphDetail.bind(null, { orgId, projectId, envId, resourceId: id }),
        // task: taskAPI.getResourcesGraphList.bind(null, { orgId, projectId, taskId, q: search, dimension })
      };
      return requestWrapper(resourcesApis[type]);
    }, {
      ready: id,
    }
  );

  const mockData = safeJsonStringify([{
    test: '测试信息',
    hha: {
      test1: '测试信息',
      test2: '测试信息',
      test3: '测试信息',
      test4: '测试信息',
      test5: '测试信息',
    }
  }, null, 2]);

  return (
    <Drawer 
      title='资源详情'
      visible={visible} 
      onClose={onClose}
      width={460}
      getContainer={false}
    >
      <Form layout="vertical">
        <Form.Item label='ID：'>
          <Input value={'alcloud_resoure.instance.xxxxx'} disabled/>
        </Form.Item>
        <Form.Item label='资源名称：'>
          <Input value={'alcloud_resoure.instance.xxxxx'} disabled/>
        </Form.Item>
        <Form.Item label='偏移检测时间：'>
          <Input value={'2021-11-11 10:12:22'} disabled/>
        </Form.Item>
        <Form.Item label='偏移信息：'>
          <FormCoder value={mockData}/>
        </Form.Item>
        <Form.Item label='所属模块：'>
          <Input value={'alcloud_resoure.instance.xxxxx'} disabled/>
        </Form.Item>
        <Form.Item label='资源类型：'>
          <Input value={'alcloud_resoure.instance.xxxxx'} disabled/>
        </Form.Item>
        <Form.Item label='详情JSON：'>
          <FormCoder value={mockData}/>
        </Form.Item>
      </Form>
    </Drawer>
  );
};