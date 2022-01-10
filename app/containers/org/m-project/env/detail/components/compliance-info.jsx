import React, { memo, useContext } from 'react';
import envAPI from 'services/env';
import DetectionCard from 'components/detection-card';
import DetailPageContext from '../detail-page-context';

const ComplianceInfo = () => {

  const { orgId, projectId, envId } = useContext(DetailPageContext);
  
  return (
    <div style={{ padding: 24 }}>
      <DetectionCard failLogParams={{ stepType: 'tfscan' }} requestFn={envAPI.result.bind(null, { orgId, projectId, envId, pageSize: 0 })} />
    </div>
  );
};
export default memo(ComplianceInfo);