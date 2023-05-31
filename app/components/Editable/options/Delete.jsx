import React, { useContext } from 'react';
import { Button } from 'antd';
import { t } from 'utils/i18n';
import { EditableContext } from '../context';

const OptionDelete = props => {
  const { id, buttonProps, buttonText } = props;

  const { handleDelete, multiple, isSetting, settingId } =
    useContext(EditableContext);

  return isSetting && settingId === id ? null : (
    <Button
      size='small'
      disabled={!multiple && isSetting}
      onClick={() => handleDelete(id)}
      {...buttonProps}
    >
      {buttonText || t('define.action.delete')}
    </Button>
  );
};

export default OptionDelete;
