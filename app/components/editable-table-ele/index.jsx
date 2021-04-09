import { Form, InputNumber, Input } from 'antd';

export const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType = 'input',
  inputRender,
  inputFieldProps,
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
    <td {...restProps}>
      {editing ? (
        <Form.Item
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
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });
};
