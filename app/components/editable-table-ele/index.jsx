import { Form, InputNumber, Input } from 'antd';

export const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  inputFieldProps,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber min={0} {...inputFieldProps} /> : <Input {...inputFieldProps} />;
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
          {inputNode}
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
        inputFieldProps: col.inputFieldProps,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });
};
