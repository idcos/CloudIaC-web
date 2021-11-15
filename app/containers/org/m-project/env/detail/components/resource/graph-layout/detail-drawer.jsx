import React from 'react';
import { Drawer } from 'antd';


export default ({ visible, id, onClose }) => {

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