import React, { useCallback, useRef, useContext, useEffect } from 'react';
import isFunction from 'lodash/isFunction';
import has from 'lodash/has';
import debounce from 'lodash/debounce';
import assign from 'lodash/assign';
import set from 'lodash/set';

import { Input } from 'antd';
import FormItem from './FormItem';
import { EditableRowContext, EditableContext } from './context';
import FieldWrap from './FieldWrap';

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  renderFormInput,
  formItemProps,
  formFieldProps,
  rowIndex,
  setRowsData,
  trigger,
  ...restProps
}) => {
  const inputRef = useRef(null);
  const { form, addWaitSaveName, removeWaitSaveName } =
    useContext(EditableRowContext);
  const formRef = useRef({ ...form });
  const { multiple, settingId } = useContext(EditableContext);
  const name = (formItemProps && formItemProps.name) || dataIndex;
  const triggerStr = typeof trigger === 'string' ? trigger : 'onChange';

  const saveFun = useCallback(
    debounce(async v => {
      const val = v || form.getFieldValue(name);
      removeWaitSaveName(name);
      setRowsData(set({}, name, val), rowIndex);
    }, 300),
    [rowIndex, name],
  );
  const save = v => {
    addWaitSaveName(name);
    saveFun(v);
  };

  useEffect(() => {
    assign(formRef.current, {
      ...form,
      setFieldsValue: values => {
        form.setFieldsValue(values);
        // 多行编辑自动更新数据；单行编辑需要手动保存数据；
        if (multiple) {
          setRowsData(
            {
              ...values,
            },
            rowIndex,
          );
        }
      },
      resetFields: fields => {
        form.resetFields(fields);
        // 多行编辑自动更新数据；单行编辑需要手动保存数据；
        if (multiple) {
          setRowsData(
            {
              ...form.getFieldsValue(),
            },
            rowIndex,
          );
        }
      },
    });
  }, [rowIndex, setRowsData]);

  let childNode = children;
  let fieldNode = (
    <Input autoComplete='off' ref={inputRef} {...formFieldProps} />
  );

  if (renderFormInput) {
    fieldNode = (
      <FieldWrap
        renderFormInput={(val, onChangeB) => {
          return renderFormInput(
            record,
            {
              value: val,
              onChange: onChangeB,
              rowIndex,
            },
            formRef.current,
          );
        }}
      />
    );
  }

  if (editable && (multiple || settingId === record.editable_id)) {
    childNode = (
      <FormItem {...formItemProps} name={name}>
        {React.cloneElement(fieldNode, {
          ...fieldNode.props,
          [triggerStr]: val => {
            if (isFunction(fieldNode.props[triggerStr])) {
              fieldNode.props[triggerStr](val);
            }
            // 单行编辑模式通过保存按钮保存内容；
            if (!multiple) {
              return;
            }
            if (triggerStr !== 'onChange') {
              save();
            } else if (has(val, 'target.value')) {
              save(val.target.value);
            } else {
              save(val);
            }
          },
        })}
      </FormItem>
    );
  } else {
    childNode = children;
  }

  return <td {...restProps}>{childNode}</td>;
};

export default EditableCell;
