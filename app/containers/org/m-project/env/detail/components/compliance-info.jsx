import React, { memo, useContext } from 'react';
import envAPI from 'services/env';
import DetectionCard from 'components/detection-card';
import DetailPageContext from '../detail-page-context';

const ComplianceInfo = () => {

  const { orgId, projectId, envId } = useContext(DetailPageContext);
  
  return (
    <DetectionCard failLogParams={{ stepType: 'tfscan' }} requestFn={envAPI.result.bind(null, { orgId, projectId, envId, currentPage: 1, pageSize: 100000 })} />
  );
};
export default memo(ComplianceInfo);