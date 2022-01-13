import React, { memo, useContext } from 'react';
import { Button } from 'antd';
import { createBrowserHistory } from 'history';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import cenvAPI from 'services/cenv';
import envAPI from 'services/env';
import DetectionCard from 'components/detection-card';
import { SCAN_DISABLE_STATUS } from 'constants/types';
import DetailPageContext from '../detail-page-context';

const ComplianceInfo = () => {

  const { orgId, projectId, envId, changeTabPage } = useContext(DetailPageContext);

  // 合规检测
  const {
    run: runScan
  } = useRequest(
    () => requestWrapper(
      cenvAPI.runScan.bind(null, { envId })
    ), {
      manual: true
    }
  );

  const renderHeaderSubContent = ({ policyStatus, refresh }) => {

    return (
      <Button 
        disabled={SCAN_DISABLE_STATUS.includes(policyStatus)}
        onClick={() => {
          runScan().then(() => {
            refresh();
          });
        }}
      >
        立即检测
      </Button>
    );
  };

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
        failLogParams={{ stepType: 'tfscan' }} 
        targetId={envId}
        requestFn={envAPI.result.bind(null, { orgId, projectId, envId, pageSize: 0 })} 
        renderHeaderSubContent={renderHeaderSubContent}
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