import React, { useState } from 'react';
import { Modal } from "antd";
import Coder from "components/coder";


export default ({ visible, data = {}, toggleVisible }) => {


  return <Modal
    title='资源详情-'
    visible={visible}
    onCancel={toggleVisible}
    width={408}
    footer={false}
    zIndex={1111111}
  >
    <Coder options={{ mode: '' }} value={JSON.stringify(data, null, 2)} style={{ height: 'auto' }} />
  </Modal>;
};
