import React, { useRef, useState, useEffect } from 'react';
import G6 from '@antv/g6';
import { appenAutoShapeListener } from '@antv/g6-react-node';
import { Space, Input, Button, Row, Drawer } from 'antd';
import { mockData1 } from './mock-data';
import styles from './styles.less';
import { registerNode, getNodeHeight } from './register-node';
import DetailDrawer from './detail-drawer';

registerNode('self-tree-node');

const GraphLayout = ({ taskId, type, orgId, projectId, envId, setMode }) => {

  const containerRef = useRef();
  const graphRef = useRef();
  const [ search, setSearch ] = useState('');
  const [ detailDrawerProps, setDetailDrawerProps ] = useState({
    visible: false
  });

  useEffect(() => {
    initGraph();
  }, []);

  // 初始化图表
  const initGraph = () => {
    const container = containerRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight || 500;
    const toolbar = new G6.ToolBar();
    const tooltip = new G6.Tooltip({
      offsetX: -20,
      offsetY: -300,
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
        const resourceList = item.resourceList || [];
        if (resourceList.length > 0) {
          allLeafList = [...allLeafList, ...resourceList];
        } else {
          allLeafList = [...allLeafList, ...getAllLeafList(itemChildren)];
        }
      });
      return allLeafList;
    };
    graphRef.current.node(function (node) {
      const { id, children, isRoot, resourceList } = node;
      return {
        id,
        resourceList: (resourceList || []).length > 0 ? resourceList : getAllLeafList(children),
        isRoot
      };
    });
    graphRef.current.data(mockData1);
    graphRef.current.render();
    graphRef.current.fitView();
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
        </Space>
        <Button onClick={() => setMode('table')}>切换列表展示</Button>
      </Row>
      <div ref={containerRef} className={styles.resourceTreeContainer}>
      </div>
      {detailDrawerProps.visible && (
        <DetailDrawer {...detailDrawerProps} onClose={onCloseDetailDrawer}/>
      )}
    </Space>
  );
};

export default GraphLayout;