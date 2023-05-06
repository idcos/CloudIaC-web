import React, { useRef } from 'react';
import { Remarkable } from 'remarkable';
import { Empty } from 'antd';

const MarkdownParser = ({ value }) => {
  const ref = useRef(new Remarkable());

  const getRawMarkup = () => {
    return { __html: ref.current.render(value) };
  };

  return value ? (
    <div className='md-content' dangerouslySetInnerHTML={getRawMarkup()}></div>
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  );
};

export default MarkdownParser;
