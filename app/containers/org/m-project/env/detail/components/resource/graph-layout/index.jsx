import React, { useRef, useState, useEffect, useContext } from 'react';
import G6 from '@antv/g6';
import { appenAutoShapeListener } from '@antv/g6-react-node';
import { Space, Input, Button, Row, Select, Spin } from 'antd';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import envAPI from 'services/env';
import taskAPI from 'services/task';
import { DIMENSION_ENUM } from 'constants/types';
import { registerNode, getNodeHeight } from './register-node';
import DetailDrawer from './detail-drawer';
import styles from './styles.less';
import isEmpty from 'lodash/isEmpty';
import DetailPageContext from '../../../detail-page-context';

registerNode('self-tree-node');

const GraphLayout = ({ setMode }) => {

  const { taskId, type, orgId, projectId, envId } = useContext(DetailPageContext);
  const containerRef = useRef();
  const graphRef = useRef();
  const [ search, setSearch ] = useState('');
  const [ dimension, setDimension ] = useState('module');
  const [ detailDrawerProps, setDetailDrawerProps ] = useState({
    visible: false
  });

  useEffect(() => {
    initGraph();
  }, []);

  const { loading } = useRequest(
    () => {
      const resourcesApis = {
        env: envAPI.getResourcesGraphList.bind(null, { orgId, projectId, envId, q: search, dimension }),
        // task: taskAPI.getResourcesGraphList.bind(null, { orgId, projectId, taskId, q: search, dimension })
      };
      return requestWrapper(resourcesApis[type]);
    }, {
      ready: dimension && envId,
      refreshDeps: [dimension, search],
      onSuccess: (data) => {
        if (!isEmpty(data)) {
          graphRef.current.data(data);
          graphRef.current.render();
          graphRef.current.fitView();
        }
      }
    }
  );

  // 初始化图表
  const initGraph = () => {
    const container = containerRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight || 500;
    const toolbar = new G6.ToolBar();
    const tooltip = new G6.Tooltip({
      offsetX: 10,
      offsetY: 10,
      itemTypes: ['node'],
      shouldBegin: (ev) => {
        const { customNodeType } = ev.target.cfg || {};
        return customNodeType === 'resource-cell';
      },
      getContent: (ev) => {
        const { name } = ev.target.cfg || {};
        return `
          <div style='width: 180px;'>${name}</div>
        `;
      }
    });
    graphRef.current = new G6.TreeGraph({
      container,
      width,
      height,
      plugins: [
        tooltip,
        // toolbar
      ],
      modes: {
        default: [
          {
            type: 'collapse-expand',
            shouldBegin: (e) => {
              const { customNodeType } = e.target.cfg;
              return customNodeType === 'collapse-expand-btn';
            }
          },
          'drag-canvas',
          'zoom-canvas',
        ],
      },
      defaultNode: {
        type: 'self-tree-node'
      },
      defaultEdge: {
        type: 'cubic-horizontal',
      },
      layout: {
        type: 'mindmap',
        direction: 'LR',
        getId: function getId(d) {
          return d.id;
        },
        getWidth: function getWidth() {
          return 400;
        },
        getHeight: getNodeHeight
      }
    });
    const getAllLeafList = (children) => {
      let allLeafList = [];
      (children || []).forEach((item) => {
        const itemChildren = item.children || [];
        const resourcesList = item.resourcesList || [];
        if (resourcesList.length > 0) {
          allLeafList = [...allLeafList, ...resourcesList];
        } else {
          allLeafList = [...allLeafList, ...getAllLeafList(itemChildren)];
        }
      });
      return allLeafList;
    };
    graphRef.current.node(function (node) {
      const { id, children, isRoot, resourcesList } = node;
      return {
        id,
        resourcesList: (resourcesList || []).length > 0 ? resourcesList : getAllLeafList(children),
        isRoot
      };
    });
    // 鼠标进入节点
    graphRef.current.on('node:mouseenter', (ev) => {
      const { customNodeType, id } = ev.target.cfg || {};
      if (customNodeType === 'resource-cell') {
        // ev.target.attrs.fill = '#ccc';
      }
    });
    // 鼠标离开节点
    graphRef.current.on('node:mouseleave', (ev) => {
      const { customNodeType, id } = ev.target.cfg || {};
      if (customNodeType === 'resource-cell') {
        // ev.target.attrs.fill = '#000';
      }
    });
    graphRef.current.on('node:click', (ev) => {
      const { customNodeType, id } = ev.target.cfg || {};
      if (customNodeType === 'resource-cell') {
        onOpenDetailDrawer(id);
      }
    });
    appenAutoShapeListener(graphRef.current);
    window.onresize = () => {
      const container = containerRef.current;
      if (!graphRef.current || graphRef.current.get('destroyed')) return;
      if (!container || !container.offsetWidth || !container.offsetHeight) return;
      graphRef.current.changeSize(container.offsetWidth, container.offsetHeight);
    };
  };

  const onOpenDetailDrawer = (id) => {
    setDetailDrawerProps({
      visible: true, 
      id
    });
  };

  const onCloseDetailDrawer = () => {
    setDetailDrawerProps({ visible: false });
  };

  return (
    <Space size='middle' direction='vertical' className={styles.graphLayout} style={{ width: '100%' }}>
      <Row justify='space-between'>
        <Space>
          <Input.Search
            placeholder='请输入关键字搜索'
            style={{ width: 240 }}
            onSearch={v => setSearch(v)}
          />
          <Select 
            value={dimension}
            onChange={setDimension}
            style={{ width: 153 }}
            options={Object.keys(DIMENSION_ENUM).map(key => ({ label: DIMENSION_ENUM[key], value: key }))}
          />
        </Space>
        <Button onClick={() => setMode('table')}>切换列表展示</Button>
      </Row>
      <Spin spinning={loading}>
        <div ref={containerRef} className={styles.resourceTreeContainer}>
        </div>
      </Spin>
      {detailDrawerProps.visible && (
        <DetailDrawer {...detailDrawerProps} onClose={onCloseDetailDrawer} orgId={orgId} projectId={projectId} envId={envId} type={type}/>
      )}
    </Space>
  );
};

export default GraphLayout;