import React, { useState, useContext, useMemo, memo } from 'react';
import { Collapse } from 'antd';
import { useEventEmitter } from 'ahooks';
import { Eb_WP } from 'components/error-boundary';
import { t } from 'utils/i18n';
import GraphLayout from './graph-layout';
import TableLayout from './table-layout';
import DetailPageContext from '../../detail-page-context';

const { Panel } = Collapse;

const Resource = () => {

  const { type } = useContext(DetailPageContext);
  const event$ = useEventEmitter();
  const [ mode, setMode ] = useState(type === 'env' ? 'graph' : 'table');

  const content = useMemo(() => {
    const modeMap = {
      'graph': <GraphLayout setMode={setMode} />,
      'table': <TableLayout setMode={setMode} />
    }
    return modeMap[mode];
  });

  return (
    <>
      <Collapse expandIconPosition={'right'} defaultActiveKey={['1']} forceRender={true}>
        <Panel header={t('define.resource.list')} key='1'>
          {content}
        </Panel>
      </Collapse>
    </>
  );
};

export default Eb_WP()(memo(Resource));
