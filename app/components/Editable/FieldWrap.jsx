import React from 'react';

// 在使用FielWrap 的renderFormInput参数时，请确保传入value和onChange参数
const FieldWrap = (props, ref) => {
  const { children, value, onChange, renderFormInput, ...propsRest } = props;
  let ele =
    typeof renderFormInput === 'function'
      ? renderFormInput(value, onChange)
      : children;

  if (React.isValidElement(ele)) {
    ele = React.cloneElement(ele, {
      value,
      onChange,
      ref,
      ...propsRest,
      ...ele.props,
    });
  } else {
    ele = <span ref={ref}>{ele}</span>;
  }

  return ele;
};

export default FieldWrap;
