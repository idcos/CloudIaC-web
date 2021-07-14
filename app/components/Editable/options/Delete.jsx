import React, { useContext } from 'react';

import { Button, Popconfirm } from 'antd';

import { EditableContext } from '../context';

const OptionDelete = (props) => {
  const {
    id,
    buttonProps,
    buttonText
  } = props;

  const { handleDelete, multiple, isSetting, settingId } = useContext(EditableContext);

  return isSetting && settingId === id ? null : <Popconfirm
    title='确认要删除当前行吗？'
    okText='确定'
    cancelText='取消'
    onConfirm={() => {
      handleDelete(id);
    }}
  >
    <Button
      size='small'
      {...buttonProps}
      disabled={!multiple && isSetting}
    >{buttonText || '删除'}</Button>
  </Popconfirm>;
};

export default OptionDelete;
