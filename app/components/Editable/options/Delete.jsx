import React, { useContext } from 'react';

import { Button, Popconfirm } from 'antd';

import { EditableContext } from '../context';

const OptionDelete = (props) => {
  const {
    id,
    buttonProps,
    buttonText
  } = props;

  console.log(1, buttonProps);
  const { handleDelete, multiple, isSetting, settingId } = useContext(EditableContext);

  return isSetting && settingId === id ? null : (
    <Button
      size='small'
      disabled={!multiple && isSetting}
      onClick={() => handleDelete(id)}
      {...buttonProps}
    >{buttonText || '删除'}</Button>
  );
};

export default OptionDelete;
