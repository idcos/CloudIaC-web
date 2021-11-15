import React, { useRef, useState, useEffect } from 'react';
import G6 from '@antv/g6';
import { appenAutoShapeListener } from '@antv/g6-react-node';
import { Space, Input, Button, Row, Drawer } from 'antd';
import { mockData1 } from '../mock-data';
import styles from './styles.less';
import { registerNode } from './register-node';
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
    graphRef.current = new G6.TreeGraph({
      container,
      width,
      height,
      plugins: [
        // toolbar
      ],
      modes: {
        default: [
          {
            type: 'collapse-expand',
            shouldBegin: (e) => {
              const { name } = e.target.cfg;
              return name === 'collapse-expand-btn';
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
        type: 'compactBox',
        direction: 'LR',
        getId: function getId(d) {
          return d.id;
        },
        getWidth: function getWidth() {
          return 236;
        },
        getHeight: function getHeight(d) {
          const cellRowLen = Math.ceil((d.list || []).length / 10);
          // 20文本高度 16间距 22一列
          return 20 + 16 + 22 * cellRowLen;
        },
        getVGap: function getVGap() {
          return 10;
        },
        getHGap: function getHGap() {
          return 100;
        },
      },
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
    // // 鼠标进入节点
    // graphRef.current.on('node:mouseenter', (e) => {
    //   console.log('mouseenter', e);
    //   const nodeItem = e.item; // 获取鼠标进入的节点元素对象
    //   graphRef.current.setItemState(nodeItem, 'hover', true); // 设置当前节点的 hover 状态为 true
    // });
    // // 鼠标离开节点
    // graphRef.current.on('node:mouseleave', (e) => {
    //   console.log('mouseleave', e);
    //   const nodeItem = e.item; // 获取鼠标离开的节点元素对象
    //   graphRef.current.setItemState(nodeItem, 'hover', false); // 设置当前节点的 hover 状态为 false
    // });
    graphRef.current.data(mockData1);
    graphRef.current.render();
    graphRef.current.fitView();
    graphRef.current.on('node:click', (ev) => {
      const { name, id } = ev.target.cfg || {};
      console.log(1, ev);
      if (name === 'resource-cell') {
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