import React, { memo } from 'react';
import { Collapse } from 'antd';
import ScanResult from "./scan-result";
import { Eb_WP } from 'components/error-boundary';
import { POLICIES_DETECTION, POLICIES_DETECTION_COLOR_COLLAPSE, POLICIES_DETECTION_ICON_COLLAPSE } from 'constants/types';
import styles from './style.less';

const { Panel } = Collapse;

const Index = (props) => {

  const { info } = props;

  return (
    <>
      <div className={styles['collapse-title']}>{info.policyGroupName || '-'}</div>
      {(info.children || []).map((it) => {
        const isError = it.status === 'violated' || it.status === 'failed';
        return (
          <div className={styles[`color-collapse-${it.status}`]}>
            <Collapse collapsible={!isError ? 'disabled' : ''} expandIconPosition={'right'}>
              <Panel showArrow={isError}
                header={
                  <span>
                    <span style={{ color: POLICIES_DETECTION_COLOR_COLLAPSE[it.status], paddingRight: 8 }}> 
                      {POLICIES_DETECTION_ICON_COLLAPSE[it.status]}
                      &nbsp;
                      {POLICIES_DETECTION[it.status]}
                    </span>
                    <span style={{ color: '#000' }}>{it.policyName}</span>
                  </span>
                } 
                key='1'
              >
                <ScanResult 
                  showHeader={true}
                  value={it}
                />
              </Panel>
            </Collapse>
          </div>
        );
      })}
    </>
  );
};

export default Eb_WP()(memo(Index));
