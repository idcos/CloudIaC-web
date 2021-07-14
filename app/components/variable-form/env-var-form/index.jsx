import React, { useContext } from 'react';
import { Card, Input, Checkbox, Tag } from 'antd';
import EditableTable from 'components/Editable';

import VarsContext from '../context';

const fields = [
  {
    title: '来自',
    id: 'from',
    width: 150,
    column: {
      render: (text) => {
        return (
          <Tag>{text}</Tag>
        );
      }
    }
  },
  {
    title: 'key',
    id: 'key',
    editable: true,
    formFieldProps: {
      placeholder: '请输入key'
    },
    formItemProps: {
      rules: [
        { required: true, message: '请输入key' }
      ]
    }
  },
  {
    title: 'value',
    id: 'value',
    editable: true,
    formItemProps: {
      rules: [{ required: true, message: '请输入value' }]
    },
    renderFormInput: (record, { value, onChange }, form) => {
      return form.getFieldValue('isSecret') ? (
        <Input.Password
          placeholder='请输入value'
          // placeholder={false ? '空值保存时不会修改原有值' : ''} // 编辑状态密文可留空
          visibilityToggle={false}
        />
      ) : (
        <Input placeholder='请输入value' />
      );
    }
  },
  {
    title: '描述信息',
    id: 'description',
    editable: true,
    formFieldProps: {
      placeholder: '请输入描述信息'
    }
  },
  {
    title: (
      <>是否敏感</>
    ),
    id: 'isSecret',
    editable: true,
    renderFormInput: (record, { value, onChange }, form) => {
      return <Checkbox checked={!!value} onChange={e => {
        if (onChange) {
          onChange(e.target.checked);
        }
      }}
      />;
    }
  }
];

const EnvVarForm = () => {

  const { envVarRef, envVarList, setEnvVarList } = useContext(VarsContext);

  return (
    <Card
      title='环境变量'
    >
      <EditableTable
        getActionRef={ref => (envVarRef.current = ref.current)}
        defaultData={{ from: '云模版' }}
        value={envVarList}
        fields={fields}
        addBtnText='添加全局变量'
        multiple={true}
        onChange={setEnvVarList}
      />
    </Card>
  );
};

export default EnvVarForm;
