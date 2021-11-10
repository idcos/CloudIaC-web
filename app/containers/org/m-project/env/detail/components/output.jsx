import React, { memo } from 'react';
import { Spin, Collapse } from 'antd';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import Coder from "components/coder";
import { Eb_WP } from 'components/error-boundary';
import envAPI from 'services/env';
import taskAPI from 'services/task';

const { Panel } = Collapse;

const Output = (props) => {

  const { match, taskId, type } = props;
  const { orgId, projectId, envId } = match.params || {};

  const { data: outputData = {}, loading } = useRequest(
    () => {
      const outputApis = {
        env: envAPI.getOutput.bind(null, { orgId, projectId, envId }),
        task: taskAPI.getOutput.bind(null, { orgId, projectId, taskId })
      };
      return requestWrapper(outputApis[type]);
    }, 
    {
      ready: !!taskId,
      formatResult: (data) => data || {}
    }
  );

  return (
    <Collapse expandIconPosition={'right'} defaultActiveKey={['1']} forceRender={true}>
      <Panel header='Output' key='1'>
        <Spin spinning={loading}>
          <Coder value={JSON.stringify(outputData, null, 2)} style={{ height: 350 }} />
        </Spin>
      </Panel>
    </Collapse>
  );
};

export default Eb_WP()(memo(Output));
