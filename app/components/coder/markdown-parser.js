import React, { useRef } from 'react';
import { Remarkable } from 'remarkable';

export default ({ value }) => {
  const ref = useRef(new Remarkable());

  const getRawMarkup = () => {
    return { __html: ref.current.render(value) };
  };

  return <div
    className='content'
    dangerouslySetInnerHTML={getRawMarkup()}
  >
  </div>;
};
