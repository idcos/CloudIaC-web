import React from 'react';
import { Card } from 'antd';

export default ({ content }) => {
  return (
    <Card title='参考内容'>
      {content}
    </Card>
  );
};