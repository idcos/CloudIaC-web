import React, { useRef, useEffect } from 'react';
import G6 from '@antv/g6';
import { appenAutoShapeListener } from '@antv/g6-react-node';
import { Space, Spin } from 'antd';
import { registerNode, getNodeHeight } from './register-node';
import styles from './styles.less';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import { filterTreeData } from './util';

registerNode('self-tree-node');

const TreeGraph = ({ search, graphData, loading, isFullscreen, onOpenDetailDrawer }) => {

  const containerRef = useRef();
  const graphRef = useRef();

  useEffect(() => {
    initGraph();
    window.onresize = () => {
      autoChangeSize();
    };
  }, []);

  useEffect(() => {
    autoChangeSize();
  }, [isFullscreen]);

  useEffect(() => {
    if (!graphData) {
      return;
    } 
    const data = filterTreeData(graphData, search);
    renderGraph(data);
  }, [search, graphData]);

  const renderGraph = (data) => {
    if (!isEmpty(data)) {
      // 确保图标实例化成功再渲染
      graphRef.current.data(data);
      graphRef.current.render();
      graphRef.current.fitView();
    }
  };

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
    graphRef.current.node(function (node) {
      const { id, children, isRoot, resourcesList } = node;
      return {
        id, children, isRoot, resourcesList 
      };
    });
    graphRef.current.on('itemcollapsed', (e) => {
      graphRef.current.updateItem(e.item, {
        collapsed: e.collapsed,
      });
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
  };

  const autoChangeSize = () => {
    const container = containerRef.current;
    if (!graphRef.current || graphRef.current.get('destroyed')) return;
    if (!container || !container.offsetWidth || !container.offsetHeight) return;
    graphRef.current.changeSize(container.offsetWidth, container.offsetHeight);
  };

  return (
    <div ref={containerRef} className={classNames(styles.resourceTreeContainer, { [styles.isFullscreen]: isFullscreen })}>
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
      <Spin spinning={loading} style={{ width: '100%', marginTop: 100 }}>
      </Spin>
    </div>
  );
};

export default TreeGraph;