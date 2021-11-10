import React, { memo } from 'react';
import { Spin, Collapse } from 'antd';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { safeJsonStringify } from 'utils/util';
import Coder from "components/coder";
import { Eb_WP } from 'components/error-boundary';
import envAPI from 'services/env';
import taskAPI from 'services/task';

const { Panel } = Collapse;

const Output = (props) => {

  const { match, taskId, type } = props;
  const { orgId, projectId, envId } = match.params || {};

  const { data: outputStr = '', loading } = useRequest(
    () => {
      const outputApis = {
        env: envAPI.getOutput.bind(null, { orgId, projectId, envId }),
        task: taskAPI.getOutput.bind(null, { orgId, projectId, taskId })
      };
      return requestWrapper(outputApis[type]);
    }, 
    {
      ready: !!taskId,
      formatResult: (data) => safeJsonStringify([data, null, 2])
    }
  );

  return (
    <Collapse expandIconPosition={'right'} defaultActiveKey={['1']} forceRender={true}>
      <Panel header='Output' key='1'>
        <Spin spinning={loading}>
          <Coder value={outputStr} style={{ height: 350 }} />
        </Spin>
      </Panel>
    </Collapse>
  );
};

export default Eb_WP()(memo(Output));
