import React from 'react';
import { Drawer } from 'antd';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import envAPI from 'services/env';

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

  return (
    <Drawer 
      title='资源详情'
      visible={visible} 
      onClose={onClose}
      width={460}
    >
      资源详情-{id}
    </Drawer>
  );
};