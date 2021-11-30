import React, { useMemo } from 'react';
import { Space, Spin, Row, Col, Tooltip } from 'antd';
import classNames from 'classnames';
import { filterListData } from './util';
import styles from './styles.less';

const ListGraph = ({ search, graphData, loading, isFullscreen, onOpenDetailDrawer }) => {

  const data = useMemo(() => {
    return filterListData(graphData, search);
  }, [search, graphData]);
  
  return (
    <div className={classNames(styles.resourceListContainer, { [styles.isFullscreen]: isFullscreen })}>
      <Space className='explain' size={16}>
        <div className='explain-item resource'>
          <span className='icon'></span>
          <span className='text'>资源</span>
        </div>
        <div className='explain-item deviation'>
          <span className='icon'></span>
          <span className='text'>漂移</span>
        </div>
      </Space>
      {loading ? (
        <Spin style={{ width: '100%', marginTop: 100 }}/>
      ) : (
        <div className='graph-body'>
          <div className='graph-list'>
            {data.map(({ nodeName, list }) => (
              <Row className='graph-item'>
                <Col className='item-text' flex='0 0 450px'>
                  <span className='node-name idcos-text-ellipsis'>{nodeName}</span>（{(list || []).length}）
                </Col>
                <Col>
                  <div className='cell-wrapper'>
                    {(list || []).map(({ name, id, isDrift }) => (
                      <Tooltip 
                        title={name} 
                        mouseEnterDelay={0}
                        mouseLeaveDelay={0}
                        getTooltipContainer={(triggerNode) => triggerNode.parentElement}
                      >
                        <div className={classNames('cell', { 'deviation': isDrift })} onClick={() => onOpenDetailDrawer(id)}></div>
                      </Tooltip>
                    ))}
                  </div>
                </Col>
              </Row>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListGraph;