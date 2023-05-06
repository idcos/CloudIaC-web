import React, { useContext, useEffect, useRef, useCallback } from 'react';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import pick from 'lodash/pick';
import has from 'lodash/has';
import { Form } from 'antd';
import { EditableRowContext, EditableContext } from './context';

const EditableRow = ({
  index,
  record,
  onRowValuesChange,
  addValidateFun,
  removeValidateFun,
  ...props
}) => {
  const [form] = Form.useForm();
  const recordPreRef = useRef();
  const { fieldNames, setRowsData, isSetting, multiple, settingId } =
    useContext(EditableContext);
  const waitSaveNamesRef = useRef([]);
  const addWaitSaveName = useCallback(name => {
    if (name && waitSaveNamesRef.current.findIndex(n => n === name) === -1) {
      waitSaveNamesRef.current.push(name);
    }
  }, []);
  const removeWaitSaveName = useCallback(name => {
    const index = waitSaveNamesRef.current.findIndex(n => n === name);
    if (index >= 0) {
      waitSaveNamesRef.current.splice(index, 1);
    }
  }, []);

  useEffect(() => {
    if (typeof addValidateFun === 'function') {
      addValidateFun(form.validateFields);
    }
    return () => {
      if (typeof removeValidateFun === 'function') {
        removeValidateFun(form.validateFields);
      }
    };
  }, []);

  useEffect(() => {
    if (
      (!isEqual(recordPreRef.current, record) && multiple) ||
      (!multiple && settingId === record && record.editable_id)
    ) {
      const resetFields = fieldNames.filter(name => {
        // 如果新的数据里面没有值，就重置当前字段，防止表格长度变化（删除、新增数据）的时候表单保留旧值；
        return (
          !has(record, name) &&
          !isEqual(get(record, name), get(recordPreRef.current, name)) &&
          waitSaveNamesRef.current.findIndex(n => n === name) === -1
        );
      });
      // 当行数据变化时，更新变化的数据；
      const setFieldsName = fieldNames.filter(name => {
        return (
          !isEqual(get(record, name), get(recordPreRef.current, name)) &&
          waitSaveNamesRef.current.findIndex(n => n === name) === -1
        );
      });
      form.resetFields(resetFields);
      if (multiple) {
        // 多行编辑模式只需要更新当前行变化的数据；
        form.setFieldsValue(pick(record, setFieldsName));
      } else {
        // 单行编辑，当编辑某行时，必须设置所有的记录值；因为form可能记录上次未保存的数据，不更新所有有数据的字段会有问题
        form.setFieldsValue(pick(record, fieldNames));
      }
    }

    // 更新保存上一个记录值；
    recordPreRef.current = record;
  }, [record, isSetting, multiple]);
  return (
    <Form
      name={`editable_${record && record._key_id}_`}
      form={form}
      onValuesChange={values => {
        if (typeof onRowValuesChange === 'function') {
          onRowValuesChange(values, {
            rowIndex: index,
            record: {
              ...record,
              ...values,
            },
            setRowsData: (row, rowI = index) => {
              setRowsData(row, rowI);
            },
          });
        }
      }}
      component={false}
    >
      <EditableRowContext.Provider
        value={{
          form,
          waitSaveNames: waitSaveNamesRef.current,
          addWaitSaveName,
          removeWaitSaveName,
          rowId: record && record._key_id,
        }}
      >
        <tr {...props} />
      </EditableRowContext.Provider>
    </Form>
  );
};

export default EditableRow;
