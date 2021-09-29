import React, { useState } from 'react';
import { Popover } from 'antd';
import { Field } from 'rc-field-form';

const Error = (props) => {
  const hasError = !!(props.errors && props.errors.length);
  const [ visible, setVisible ] = useState(false);
  let children = props.children;

  if (React.isValidElement(props.children)) {
    children = React.cloneElement(props.children, {
      ...props.children.props
    });
  }

  return (
    <div className={hasError ? 'ant-form-item-has-error' : ''}>
      <Popover
        placement='topLeft'
        trigger='hover'
        visible={visible && hasError}
        onVisibleChange={v => {
          setVisible(v);
        }}
        overlayClassName={hasError ? 'ant-form-item-has-error' : ''}
        content={
          <div
            className={
              hasError
                ? 'ant-form-item-explain ant-form-item-explain-error'
                : ''
            }
          >
            {props.errors.map((str, index) => {
              return (
                <div role='alert' key={index}>
                  {str}
                </div>
              );
            })}
          </div>
        }
      >
        <div>
          {children}
        </div>
      </Popover>
    </div>
  );
};

const FormItem = props => {
  const { children, ...restProps } = props;
  const trigger = props.trigger || 'value';
  return (
    <Field {...restProps}>
      {({ value, onChange }, { errors }) => {
        let childNode = children;
        if (React.isValidElement(children)) {
          childNode = React.cloneElement(children, {
            [trigger]: value,
            ...children.props,
            onChange: (val) => {
              onChange(val);
              if (typeof children.props.onChange === 'function') {
                children.props.onChange(val);
              }
            }
          });
        }
        return <Error errors={errors}>{childNode}</Error>;
      }}
    </Field>
  );
};

export default FormItem;
