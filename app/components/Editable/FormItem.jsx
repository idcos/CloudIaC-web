import React, { useState, useContext } from 'react';
import { InternalFieldProps } from 'rc-field-form/lib/Field';

import { Popover } from 'antd';
import { Field } from 'rc-field-form';
import { EditableRowContext, EditableContext } from './context';

const Error = (props) => {
  const hasError = !!(props.errors && props.errors.length);
  const [ visible, setVisible ] = useState(false);
  let children = props.children;

  if (React.isValidElement(props.children)) {
    children = React.cloneElement(props.children, {
      ...props.children.props,
      onMouseLeave: (e) => {
        if (visible) {
          setVisible(false); 
        }
        if (typeof (props.children.props && props.children.props.onMouseLeave) === 'function') {
          props.children.props.onMouseLeave(e);
        }
      }
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
        {children}
      </Popover>
    </div>
  );
};

const FormItem = props => {
  const { children, ...restProps } = props;
  const trigger = props.trigger || 'value';
  const { rowId } = useContext(EditableRowContext);
  const { errorMap, addErrorMapItem, removeErrorMapItem } = useContext(
    EditableContext
  );
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
