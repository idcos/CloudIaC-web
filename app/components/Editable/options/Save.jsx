import React, { useContext } from 'react';
import omit from 'lodash/omit';
import { ButtonProps } from 'antd/lib/button';

import { Button, Popconfirm } from 'antd';
import { t } from 'utils/i18n';
import { EditableContext, EditableRowContext } from '../context';

const OptionSave = (props) => {
  const {
    id,
    buttonProps,
    buttonText
  } = props;

  const { handleEdit, multiple, isSetting, settingId, setRowsData } = useContext(EditableContext);
  const { form } = useContext(EditableRowContext);

  const save = async (id) => {
    try {
      const data = await form.validateFields();
      setRowsData(data, id);
      handleEdit(-1);
    } catch (e) {
      console.log(e);
    }
  };

  return !multiple && isSetting && settingId === id ? <Button
    size='small'
    {...omit(buttonProps, [
      'onClick',
      'disabled'
    ])}
    onClick={() => {
      save(id);
    }}
  >{buttonText || t('define.action.save')}</Button> : null;
};

export default OptionSave;
