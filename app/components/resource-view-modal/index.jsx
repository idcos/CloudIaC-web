import React, { useState } from 'react';
import { Modal, Spin } from 'antd';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { safeJsonStringify } from 'utils/util';
import Coder from 'components/coder';
import envAPI from 'services/env';

export default ({ event$ }) => {

  const [ visible, setVisible ] = useState(false);
  const [ params, setParams ] = useState({});

  // 列表查询
  const {
    loading,
    data,
    run,
    mutate
  } = useRequest(
    (params) => requestWrapper(
      envAPI.getResources.bind(null, params)
    ), {
      manual: true
    }
  );

  const onOpen = (params) => {
    setVisible(true);
    setParams(params);
    run(params);
  };

  const onClose = () => {
    setVisible(false);
    setParams({});
    mutate();
  };

  event$.useSubscription(({ type, data = {} }) => {
    switch (type) {
      case 'open-resource-view-modal':
        onOpen(data.params);
        break;
      default:
        break;
    }
  });

  return (
    <Modal
      title={`资源详情-${params.resourceName}`}
      visible={visible}
      onCancel={onClose}
      cancelButtonProps={{ 
        className: 'ant-btn-tertiary' 
      }}
      width={600}
      footer={false}
      zIndex={1111111}
    >
      <div style={{ height: 380, overflowY: 'auto' }}>
        {
          <Spin spinning={loading}>
            <Coder value={safeJsonStringify([data, null, 2])} style={{ height: 'auto' }} />
          </Spin>
        }
      </div>
    </Modal>
  );
};
