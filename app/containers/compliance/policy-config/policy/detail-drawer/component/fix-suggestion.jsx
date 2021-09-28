import React from 'react';
import { Card } from 'antd';

export default ({ content }) => {
  return (
    <Card title='参考内容' type='inner' bodyStyle={{ minHeight: 300 }}>
      <div className='idcos-format-html' dangerouslySetInnerHTML={{ __html: content }}></div>
    </Card>
  );
};