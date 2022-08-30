import React from 'react';
import { Drawer } from "antd";
import ctplAPI from 'services/ctpl';
import DetectionCard from 'components/detection-card';
import { t } from 'utils/i18n';

export default ({ visible, onClose, id }) => {

  return (
    <Drawer
      title={t('define.scanDetail')}
      placement='right'
      visible={visible}
      onClose={onClose}
      width={800}
    >
      <DetectionCard 
        targetType='template' 
        targetId={id}
        requestFn={ctplAPI.result.bind(null, { tplId: id, pageSize: 0 })} 
        runScanRequestFn={ctplAPI.runScan.bind(null, { tplId: id })}
      />
    </Drawer>
  );
};