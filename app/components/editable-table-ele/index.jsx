import { Form, InputNumber, Input } from 'antd';

export const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType = 'input',
  inputRender,
  inputFieldProps,
  fieldItemProps,
  record,
  index,
  children,
  ...restProps
}) => {
  const insetInputType = {
    number: <InputNumber min={0} {...inputFieldProps} />,
    input: <Input {...inputFieldProps} />,
    other: <Form.Item
      noStyle={true}
      shouldUpdate={true}
    >
      {inputRender}
    </Form.Item>
  };
  return (
    <td className='reset-styles' {...restProps}>
      {editing ? (
        inputType == 'other' ? insetInputType.other : <Form.Item
          name={dataIndex}
          style={{
            margin: 0
          }}
          rules={[
            {
              required: true,
              message: '请输入'
            }
          ]}
          {...fieldItemProps}
        >
          {insetInputType[inputType]}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export const columnsOverride = (_columns = [], isEditing, inputFieldProps) => {
  return _columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.inputType,
        inputRender: col.inputRender,
        inputFieldProps: col.inputFieldProps,
        fieldItemProps: col.fieldItemProps,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });
};
