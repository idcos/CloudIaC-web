import React from 'react';
import G6 from '@antv/g6';
import { Rect, Text, Circle, Group, Image, createNodeFromReact } from '@antv/g6-react-node';
import { ellipsisText } from 'utils/util';

const Cell = ({ name, id, deviation }) => {
  const props = {
    id,
    name,
    customNodeType: 'resource-cell'
  };
  const commonRectStyle = {
    width: 22, 
    height: 22, 
    justifyContent: 'center', 
    alignItems: 'center', 
    cursor: 'pointer'
  };
  return deviation ? (
    <Rect 
      {...props} 
      zIndex={20}
      style={{ ...commonRectStyle, stroke: '#916504', fill: '#E3A322' }}
    >
      <Image 
       {...props} 
        style={{
          img: '/assets/icons/drift.svg',
          width: 22, 
          height: 22, 
          cursor: 'pointer' 
        }}
      />
    </Rect>
  ) : (
    <Rect 
      {...props} 
      zIndex={1}
      style={{ ...commonRectStyle, stroke: '#0B847C', fill: '#11978E' }}
    >
    </Rect>
  );
};

const Dot = () => (
  <Circle customNodeType='collapse-expand-btn' style={{ fill: '#0B847C', r: 4, cursor: 'pointer' }}></Circle>
);


const TreeNode = ({ cfg }) => {

  const { nodeName, resourceList, isRoot } = cfg;
  
  return isRoot ? <Dot /> : (
    <Group>
      <Rect
        style={{
          flexDirection: 'column', 
        }}
      >
        <Rect
          style={{
            height: 20,
            flexDirection: 'row', 
            alignItems: 'center'
          }}
        >
          <Dot />
          <Text customNodeType='collapse-expand-btn' style={{ fill: '#0B847C', fontSize: 16, margin: [0, 0, 0, 8], cursor: 'pointer' }}>
            {ellipsisText(nodeName, 20)}
          </Text>
        </Rect>
        {
          resourceList.length > 0 && (
            <Rect style={{ maxWidth: 22 * 10, flexWrap: 'wrap', flexDirection: 'row', margin: [8, 0, 0, 16] }}>
              {
                resourceList.map(({ nodeId, nodeName, deviation }) => (
                  <Cell id={nodeId} name={nodeName} deviation={deviation}/>
                ))
              }
            </Rect>
          )
        }
      </Rect>
    </Group>
  );
};

export const getNodeHeight = (cfg) => {
  const cellRowLen = Math.ceil((cfg.resourceList || []).length / 10);
  return cfg.isRoot ? 8 : (20 + 8 + 22 * cellRowLen);
};

export const registerNode = (shapeType) => {
  G6.registerNode(shapeType, {
    ...createNodeFromReact(TreeNode), 
    getAnchorPoints: (cfg) => {
      const top = 20 / getNodeHeight(cfg) / 2;
      if (cfg.isRoot) {
        return [[0, 0.5], [1, 0.5]];
      } else {
        return [[0, top], [1, top]];
      }
    }
  });
};

