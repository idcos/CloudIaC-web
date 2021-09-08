import React, { useState, useEffect } from 'react';
import { Modal, notification } from 'antd';
import Coder from 'components/coder';
import envAPI from 'services/env';



export default ({ visible, toggleVisible, params, orgId, projectId, envId, resourceId }) => {

  const [ data, setData ] = useState({});

  useEffect(() => {
    fetchList();
  }, []);


  const fetchList = async () => {
    try {
      const res = await envAPI.getResources({
        orgId, projectId, envId, resourceId: params.id
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setData(res.result || {});
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  return <Modal
    title={`资源详情-${params.name}`}
    visible={visible}
    onCancel={toggleVisible}
    width={600}
    footer={false}
    zIndex={1111111}
  >
    <Coder options={{ mode: '' }} value={JSON.stringify(data, null, 2)} style={{ height: 'auto' }} />
  </Modal>;
};
