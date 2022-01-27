import React, { memo, useContext } from 'react';
import { createBrowserHistory } from 'history';
import cenvAPI from 'services/cenv';
import envAPI from 'services/env';
import DetectionCard from 'components/detection-card';
import DetailPageContext from '../detail-page-context';

const ComplianceInfo = () => {

  const { orgId, projectId, envId, changeTabPage, reload } = useContext(DetailPageContext);

  const openComplianceScan = () => {
    const history = createBrowserHistory({ forceRefresh: false });
    history.replace({
      search: `?tabKey=setting&formTab=compliance`
    });
    changeTabPage('setting');
  };
  
  return (
    <div style={{ padding: 24 }}>
      <DetectionCard 
        // failLogParams={{ stepType: 'tfscan' }} 
        targetId={envId}
        targetType='env'
        requestFn={envAPI.result.bind(null, { orgId, projectId, envId, pageSize: 0 })} 
        runScanRequestFn={cenvAPI.runScan.bind(null, { envId })}
        onSuccessCallback={reload}
        disableEmptyDescription={
          <span>
            <span>未开启合规检测，</span><a onClick={openComplianceScan}>去开启</a>
          </span>
        }
      />
    </div>
  );
};
export default memo(ComplianceInfo);