import React, { memo, useState, useEffect, useMemo } from 'react';
import { Card, Descriptions, Tag, Collapse } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

import { ENV_STATUS, AUTO_DESTROY, ENV_STATUS_COLOR } from 'constants/types';
import AnsiCoderCard from "components/coder/ansi-coder-card/detection-result";
import { Eb_WP } from 'components/error-boundary';
import { timeUtils } from "utils/time";
import moment from 'moment';
import styles from './style.less';
import { POLICIES_DETECTION, POLICIES_DETECTION_COLOR } from 'constants/types';

const { Panel } = Collapse;

const Index = (props) => {

  const { info, taskInfo } = props;

  // const getDate = useMemo(() => {
  //   let ll = `"code": "resource "alicloud_vpc" "jack_vpc" {\n  vpc_name = "tf_jack_vpc"\n  cidr_block = "172.16.0.0/12""`;
  //   let ls = ll.replace(/"/g, '');
  //   let lt = ls.split('\n');
  //   return [ '策略组名称 policyGroupName',
  //     '策略名称 policyName',
  //     '严重程度 severity',
  //     '资源类型 resourceType',
  //     '文件 filePath',
  //     '错误所在行数 10',
  //     '参考源码 code   提供从 line 开始向后共 3 行源码',
  //     // eslint-disable-next-line no-unexpected-multiline
  //     // `"code": "resource "alicloud_vpc" "jack_vpc" {\n  vpc_name = "tf_jack_vpc"\n  cidr_block = "172.16.0.0/12""`
  //     ...lt
  //   ];
  // }, []);
  return <> 
    {info.children.map((it) => {
      const isError = it.status === 'pending';
      return (
        <>
          <div className={styles['collapse-title']}>{info.policyGroupName || '-'}</div>
          <div className={styles[`color-collapse-${it.status}`]}>
            <Collapse collapsible={!isError ? 'disabled' : ''} expandIconPosition={'right'}>
              <Panel showArrow={isError}
                header={
                  <span><span style={{ color: POLICIES_DETECTION_COLOR[it.status], paddingRight: 8 }}><CheckCircleOutlined />  {POLICIES_DETECTION[it.status]}</span><span style={{ color: '#000' }}>{it.policyName}</span></span>
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
        </>
      );
    })}

    
  </>;
};

export default Eb_WP()(memo(Index));
