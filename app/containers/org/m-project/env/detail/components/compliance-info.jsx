import React, { memo } from 'react';
import envAPI from 'services/env';
import DetectionCard from 'components/detection-card';

const Index = (props) => {
  const { match } = props;
  const { params: { orgId, projectId, envId } } = match;
  
  return (
    <DetectionCard requestFn={envAPI.result.bind(null, { orgId, projectId, envId, currentPage: 1, pageSize: 100000 })} />
  );
};
export default memo(Index);