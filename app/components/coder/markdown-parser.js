import React, { useRef } from 'react';
import { Remarkable } from 'remarkable';
import { Empty } from 'antd';

export default ({ value }) => {
  const ref = useRef(new Remarkable());

  const getRawMarkup = () => {
    return { __html: ref.current.render(value) };
  };

  return value ? <div
    className='md-content'
    dangerouslySetInnerHTML={getRawMarkup()}
  >
  </div> : <Empty />;
};
