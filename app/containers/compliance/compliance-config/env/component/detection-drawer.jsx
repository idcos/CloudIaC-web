import React from 'react';
import { Drawer } from "antd";
import cenvAPI from 'services/cenv';
import DetectionCard from 'components/detection-card';

export default ({ visible, onClose, id }) => {

  return (
    <Drawer
      title='检测详情'
      placement='right'
      visible={visible}
      onClose={onClose}
      width={800}
      bodyStyle={{
        padding: 0,
        flex: 1,
        minHeight: 0
      }}
    >
      <DetectionCard canFullHeight={true} requestFn={cenvAPI.result.bind(null, { envId: id, pageSize: 0 })} />
    </Drawer>
  );
};