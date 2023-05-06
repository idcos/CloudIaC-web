/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo, useContext } from 'react';
import { createBrowserHistory } from 'history';
import cenvAPI from 'services/cenv';
import envAPI from 'services/env';
import { t } from 'utils/i18n';
import DetectionCard from 'components/detection-card';
import DetailPageContext from '../detail-page-context';

const ComplianceInfo = () => {
  const { orgId, projectId, envId, changeTabPage, reload, taskId, type } =
    useContext(DetailPageContext);

  const openComplianceScan = () => {
    const history = createBrowserHistory({ forceRefresh: false });
    history.replace({
      search: '?tabKey=setting&formTab=compliance',
    });
    changeTabPage('setting');
  };

  return (
    <div style={{ padding: 24 }}>
      {type === 'env' ? (
        <DetectionCard
          targetId={envId}
          targetType='env'
          requestFn={envAPI.result.bind(null, {
            orgId,
            projectId,
            envId,
            pageSize: 0,
          })}
          runScanRequestFn={cenvAPI.runScan.bind(null, { envId })}
          onSuccessCallback={reload}
          disableEmptyDescription={
            <span>
              <span>{t('define.noOpenComplianceScan')}</span>
              <a onClick={openComplianceScan}>{t('define.action.goOpen')}</a>
            </span>
          }
        />
      ) : (
        <DetectionCard
          // 任务也只和环境做关联
          targetId={envId}
          targetType='env'
          requestFn={envAPI.result.bind(null, {
            orgId,
            projectId,
            envId,
            taskId,
            pageSize: 0,
          })}
          onSuccessCallback={reload}
          canScan={type === 'env'}
        />
      )}
    </div>
  );
};
export default memo(ComplianceInfo);
