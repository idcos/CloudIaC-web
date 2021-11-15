import React, { useState, useEffect, useMemo, memo } from 'react';
import { Table, Input, Collapse, Space } from 'antd';
import { useRequest, useEventEmitter } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { Eb_WP } from 'components/error-boundary';
import ResourceViewModal from 'components/resource-view-modal';
import envAPI from 'services/env';
import taskAPI from 'services/task';
import GraphLayout from './graph-layout';
import TableLayout from './table-layout';

const { Panel } = Collapse;

const Index = (props) => {

  const event$ = useEventEmitter();
  const { match, taskId, type } = props;
  const { orgId, projectId, envId } = match.params || {};
  const [ mode, setMode ] = useState('graph');

  const content = useMemo(() => {
    const props = { taskId, type, orgId, projectId, envId, setMode };
    const modeMap = {
      'graph': <GraphLayout {...props} />,
      'table': <TableLayout {...props} />
    }
    return modeMap[mode];
  });

  return (
    <>
      <Collapse expandIconPosition={'right'} defaultActiveKey={['1']} forceRender={true}>
        <Panel header='资源列表' key='1'>
          {content}
        </Panel>
      </Collapse>
      <ResourceViewModal event$={event$}/>
    </>
  );
};

export default Eb_WP()(memo(Index));
