import React, { useContext } from 'react';

import { Button, Popconfirm } from 'antd';

import { EditableContext } from '../context';

const OptionCancel = props => {
  const { id, buttonProps, buttonText } = props;

  const { handleEdit, isSetting, multiple, settingId } =
    useContext(EditableContext);

  const cancel = () => {
    handleEdit(-1);
  };

  return !multiple && isSetting && settingId === id ? (
    <Popconfirm
      title='确认要取消编辑？'
      okText='确定'
      cancelText='取消'
      onConfirm={() => {
        cancel();
      }}
    >
      <Button size='small' {...buttonProps}>
        {buttonText || '取消'}
      </Button>
    </Popconfirm>
  ) : null;
};

export default OptionCancel;
