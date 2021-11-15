import React from 'react';
import G6 from '@antv/g6';
import { Rect, Text, Circle, Group, createNodeFromReact } from '@antv/g6-react-node';
import { ellipsisText } from 'utils/util';

const Cell = ({ id }) => {
  const onMouseEnter = (event, node, shape, graph) => {
    console.log(111, event, node, shape, graph);
  };
  return (
    <Rect capture={true} onMouseEnter={onMouseEnter} id={id} name='resource-cell' style={{ width: 22, height: 22, stroke: '#0B847C', fill: '#11978E' }}>
    </Rect>
  );
};

const Dot = () => (
  <Circle cursor='point' name='collapse-expand-btn' style={{ fill: '#0B847C', r: 4 }}></Circle>
);


const TreeNode = ({ cfg }) => {

  const { nodeName, resourceList, isRoot } = cfg;
  
  return isRoot ? <Dot /> : (
    <Group>
      <Rect
        style={{
          flexDirection: 'row', 
          alignItems: 'center',
        }}
      >
        <Dot />
        <Rect style={{ width: 'auto', flexDirection: 'column', margin: [0, 0, 0, 8] }}>
          <Text name='collapse-expand-btn' style={{ fill: '#0B847C', fontSize: 16 }}>
            {ellipsisText(nodeName, 20)}
          </Text>
          {
            resourceList.length > 0 && (
              <Rect style={{ maxWidth: 22 * 10, flexWrap: 'wrap', flexDirection: 'row', margin: [8, 0, 0, 0] }}>
                {
                  resourceList.map(({ nodeId }) => (
                    <Cell id={nodeId} />
                  ))
                }
              </Rect>
            )
          }
        </Rect>
      </Rect>
    </Group>
  );
};

export const registerNode = (shapeType) => {
  G6.registerNode(shapeType, createNodeFromReact(TreeNode));
};

