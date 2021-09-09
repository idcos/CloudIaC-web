import React, { memo, useState, useEffect, useMemo } from 'react';
import { Card, Descriptions, Tag, Collapse } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

import { ENV_STATUS, AUTO_DESTROY, ENV_STATUS_COLOR } from 'constants/types';
import AnsiCoderCard from "components/coder/ansi-coder-card/detection-result";
import { Eb_WP } from 'components/error-boundary';
import { timeUtils } from "utils/time";
import moment from 'moment';
import styles from './style.less';
import { POLICIES_DETECTION, POLICIES_DETECTION_COLOR_COLLAPSE, POLICIES_DETECTION_ICON_COLLAPSE } from 'constants/types';

const { Panel } = Collapse;

const Index = (props) => {

  const { info, taskInfo } = props;
  return <> 
    <>
      <div className={styles['collapse-title']}>{info.policyGroupName || '-'}</div>
      {info.children.map((it) => {
        const isError = it.status === 'violated' || it.status === 'failed';
        return (
          <div className={styles[`color-collapse-${it.status}`]}>
            <Collapse collapsible={!isError ? 'disabled' : ''} expandIconPosition={'right'}>
              <Panel showArrow={isError}
                header={
                  <span><span style={{ color: POLICIES_DETECTION_COLOR_COLLAPSE[it.status], paddingRight: 8 }}> {POLICIES_DETECTION_ICON_COLLAPSE[it.status]}  {POLICIES_DETECTION[it.status]}</span><span style={{ color: '#000' }}>{it.policyName}</span></span>
                } 
                key='1'
              >
                <AnsiCoderCard 
                  showHeader={true}
                  value={it}
                />
              </Panel>
            </Collapse>
          </div>
        );
      })}
    </>
  </>;
};

export default Eb_WP()(memo(Index));
