import React from 'react';
import { Drawer, Form, Input, Spin } from 'antd';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import envAPI from 'services/env';
import FormCoder from 'components/coder/form-coder';
import FormAnsiCoder from 'components/coder/form-ansi-coder';
import { safeJsonStringify } from 'utils/util';

export default ({ visible, id, onClose, orgId, projectId, envId, type }) => {
  
  const { data = {}, loading } = useRequest(
    () => requestWrapper(
      envAPI.getResourcesGraphDetail.bind(null, { orgId, projectId, envId, resourceId: id })
    ), {
      ready: !!id
    }
  );

  return (
    <Drawer 
      title='资源详情'
      visible={visible} 
      onClose={onClose}
      width={460}
      getContainer={false}
    >
      <Spin spinning={loading}>
        <Form layout="vertical">
          <Form.Item label='ID：'>
            <Input value={data.id} disabled/>
          </Form.Item>
          <Form.Item label='资源名称：'>
            <Input value={data.name} disabled/>
          </Form.Item>
          {data.isDrift && (
            <>
              <Form.Item label='漂移检测时间：'>
                <Input value={data.createAt && moment(data.createAt).format('YYYY-MM-DD HH:mm:ss')} disabled/>
              </Form.Item>
              <Form.Item label='漂移信息：'>
                <FormAnsiCoder value={data.resourceDetail}/>
              </Form.Item>
            </>
          )}
          <Form.Item label='所属模块：'>
            <Input value={data.module} disabled/>
          </Form.Item>
          <Form.Item label='资源类型：'>
            <Input value={data.type} disabled/>
          </Form.Item>
          <Form.Item label='详情JSON：'>
            <FormCoder value={safeJsonStringify([data.attrs, null, 2])}/>
          </Form.Item>
        </Form>
      </Spin>
    </Drawer>
  );
};