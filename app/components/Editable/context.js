import React from 'react';

// 默认函数，在正常使用时，默认值会被覆盖，所以在注册值之前使用可给出统一的警告；
const defaultFun = () => {}; // eslint-disable-line

export const EditableContext = React.createContext({
  fieldNames: [], // 可编辑表单单元格form表单的name列表
  setRowsData: defaultFun,
  handleDelete: defaultFun,
  handleEdit: defaultFun,
  move: defaultFun,
  setSequenceId: defaultFun,
  state: [],
  errorMap: {},
  addErrorMapItem: defaultFun,
  removeErrorMapItem: defaultFun,
});

export const EditableRowContext = React.createContext({
  form: {}, // 设置form默认值，正确使用，此值将会被覆盖
  waitSaveNames: [],
  addWaitSaveName: () => {}, // eslint-disable-line
  removeWaitSaveName: () => {}, // eslint-disable-line
  rowId: '',
});
