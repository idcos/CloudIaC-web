import { useState, useCallback, useMemo, useRef } from 'react';
import omit from 'lodash/omit';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import set from 'lodash/set';
import { getEditableIdByIndex, getIndexByEditableId } from './utils';

export const useEditableState = ({
  value,
  defaultData,
  defaultValue = [],
  onChange,
  max
}) => {
  const keyIdRef = useRef(1);
  const errorMapRef = useRef({});
  const [ _state, setState ] = useState(
    Array.isArray(defaultValue) ? defaultValue : []
  );
  const [ settingId, setSettingId ] = useState();
  const [ sequenceId, setSequenceId ] = useState();
  const stateRef = useRef([]);

  stateRef.current = useMemo(() => {
    const list = isArray(value) ? value : _state;
    const end = max || list.length;
    return list.slice(0, end).map((item, index) => ({
      ...item,
      editable_id: getEditableIdByIndex(index),
      _key_id: get(item, '_key_id') || keyIdRef.current++
    }));
  }, [ value, _state ]);

  const handleChange = (val) => {
    const end = max || val.length;
    if (isFunction(onChange)) {
      onChange(val.slice(0, end).map(item => omit(item, ['editable_id']))); 
    }

    setState(val.slice(0, end));
  };

  const handleAdd = useCallback((data) => {
    const newData = data || defaultData || {};
    handleChange([ ...stateRef.current, newData ]);
  }, []);

  const handleDelete = useCallback((key) => {
    const k = getEditableIdByIndex(key);
    handleChange(
      stateRef.current.filter((item) => item.editable_id !== k)
    );
  }, []);

  const handleEdit = useCallback((key) => {
    const k = getEditableIdByIndex(key);
    setSettingId(k);
  }, []);

  const setRowsData = useCallback((rowData, id) => {
    const index = getIndexByEditableId(id);
    const newRowData = {
      ...stateRef.current[index],
      ...omit(rowData, ['editable_id'])
    };
    const list = [...stateRef.current];
    list[index] = newRowData;
    handleChange(list);
  }, []);

  const move = (id, toIndex) => {
    const rowIndex = getIndexByEditableId(id);
    if (toIndex === rowIndex || !isNumber(rowIndex) || !isNumber(toIndex)) {
      return; 
    }
    const list = [...stateRef.current];
    const item = list.splice(rowIndex, 1)[0];
    if (item) {
      list.splice(toIndex, 0, item);
      handleChange(list);
    }
  };

  const addErrorMapItem = useCallback((id, errors) => {
    set(errorMapRef.current, id, errors);
  }, []);
  const removeErrorMapItem = useCallback((id) => {
    delete errorMapRef.current[id];
  }, []);

  return {
    state: stateRef.current,
    handleAdd,
    setRowsData,
    handleDelete,
    handleEdit,
    move,
    settingId,
    sequenceId,
    setSequenceId,
    isSetting:
      stateRef.current.findIndex(
        (record) => record.editable_id === settingId
      ) >= 0,
    errorMap: errorMapRef.current,
    addErrorMapItem,
    removeErrorMapItem
  };
};

export const useValidateObservers = () => {
  const validatesRef = useRef([]);

  const addValidateFun = useCallback((fun) => {
    if (validatesRef.current.findIndex(f => f === fun) === -1) {
      validatesRef.current.push(fun);
    }
  }, []);
  const removeValidateFun = useCallback(
    (fun) => {
      const index = validatesRef.current.findIndex(f => f === fun);
      if (index >= 0) {
        validatesRef.current.splice(index, 1);
      }
    },
    []
  );

  const notifyObservers = useCallback(async () => {
    const errors = (
      await Promise.all(
        validatesRef.current.map(async fun => {
          const res = fun()
            .then(() => null)
            .catch(err => err);
          return res;
        })
      )
    ).filter(item => item);
    if (errors && errors.length) {
      return Promise.reject(errors.flat());
    }
    return Promise.resolve(null);
  }, []);

  return {
    addValidateFun,
    removeValidateFun,
    notifyObservers
  };
};
