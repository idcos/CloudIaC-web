import React from 'react';
import { Drawer } from 'antd';
import cenvAPI from 'services/cenv';
import DetectionCard from 'components/detection-card';
import { t } from 'utils/i18n';

const DetectionDrawer = ({ visible, onClose, id }) => {
  return (
    <Drawer
      title={t('define.scanDetail')}
      placement='right'
      visible={visible}
      onClose={onClose}
      width={800}
    >
      <DetectionCard
        targetType='env'
        targetId={id}
        requestFn={cenvAPI.result.bind(null, { envId: id, pageSize: 0 })}
        runScanRequestFn={cenvAPI.runScan.bind(null, { envId: id })}
      />
    </Drawer>
  );
};

export default DetectionDrawer;
