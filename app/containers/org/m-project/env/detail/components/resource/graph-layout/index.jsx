import React, { useRef, useState, useContext } from 'react';
import { Space, Input, Button, Row, Select } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined, MenuOutlined } from "@ant-design/icons";
import { useRequest, useFullscreen } from 'ahooks';
import { requestWrapper } from 'utils/request';
import envAPI from 'services/env';
import taskAPI from 'services/task';
import { DIMENSION_ENUM } from 'constants/types';
import DetailDrawer from '../components/detail-drawer';
import styles from './styles.less';
import DetailPageContext from '../../../detail-page-context';
import TreeGraph from './tree-graph';
import ListGraph from './list-graph';

const GraphLayout = ({ setMode }) => {

  const { taskId, type, orgId, projectId, envId } = useContext(DetailPageContext);
  const ref = useRef();
  const [ isFullscreen, { toggleFull } ] = useFullscreen(ref);
  const [ search, setSearch ] = useState('');
  const [ dimension, setDimension ] = useState('module');
  const [ detailDrawerProps, setDetailDrawerProps ] = useState({
    visible: false
  });

  const { loading, data: graphData, mutate: mutateGraphData, run: fetchGraphData } = useRequest(
    () => {
      const resourcesApis = {
        env: envAPI.getResourcesGraphList.bind(null, { orgId, projectId, envId, dimension }),
        task: taskAPI.getResourcesGraphList.bind(null, { orgId, projectId, taskId, dimension })
      };
      return requestWrapper(resourcesApis[type]);
    }, {
      ready: dimension && envId,
      refreshDeps: [dimension],
    }
  );

  const onOpenDetailDrawer = (id) => {
    setDetailDrawerProps({
      visible: true, 
      id
    });
  };

  const onCloseDetailDrawer = () => {
    setDetailDrawerProps({ visible: false });
  };
 
  // 切换图形查看类型先重置数据再查询，避免异步获取数据过程中数据格式与图形不匹配
  const onChangeDimension = (v) => {
    setDimension(v);
    mutateGraphData(); 
    fetchGraphData();
  };

  return (
    <div 
      ref={ref}
      className={styles.graphLayout}
    >
      <Row justify='space-between' className={styles.header}>
        <Space>
          <Input.Search
            placeholder='请输入关键字搜索'
            style={{ width: 240 }}
            onSearch={v => setSearch(v)}
          />
          <Select 
            value={dimension}
            getPopupContainer={triggerNode => triggerNode.parentElement}
            onChange={onChangeDimension}
            style={{ width: 153 }}
            options={Object.keys(DIMENSION_ENUM).map(key => ({ label: DIMENSION_ENUM[key], value: key }))}
          />
          <div className='tool-item' onClick={toggleFull}>
            {
              isFullscreen ? (
                <>
                  <FullscreenExitOutlined className='icon'/>
                  <span>退出全屏</span> 
                </>
              ) : (
                <>
                  <FullscreenOutlined className='icon'/>
                  <span>全屏显示</span>
                </>
              )
            }
          </div>
        </Space>
        {type === 'env' && (
          <Button onClick={() => setMode('table')} icon={<MenuOutlined/>}>
            切换列表展示
          </Button>
        )}
      </Row>
      {dimension === 'module' ? (
        <TreeGraph 
          search={search}
          graphData={graphData}
          loading={loading}
          isFullscreen={isFullscreen}
          onOpenDetailDrawer={onOpenDetailDrawer}
        />
      ) : (
        <ListGraph 
          search={search}
          graphData={graphData}
          loading={loading}
          isFullscreen={isFullscreen}
          onOpenDetailDrawer={onOpenDetailDrawer}
        />
      )}
      {detailDrawerProps.visible && (
        <DetailDrawer {...detailDrawerProps} onClose={onCloseDetailDrawer} orgId={orgId} projectId={projectId} envId={envId} type={type}/>
      )}
    </div>
  );
};

export default GraphLayout;