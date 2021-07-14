import React, { useContext, useState } from 'react';
import { Card, Input, Checkbox, Tag } from 'antd';
import EditableTable from 'components/Editable';

import VarsContext from '../context';
import { SCOPE_ENUM } from '../enum';

const fields = [
  {
    title: '来自',
    id: 'scope',
    width: 150,
    column: {
      render: (text) => {
        return (
          <Tag>{SCOPE_ENUM[text]}</Tag>
        );
      }
    }
  },
  {
    title: 'name',
    id: 'name',
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
      return form.getFieldValue('sensitive') ? (
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
    id: 'sensitive',
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

const TerraformVarForm = () => {

  const { terraformVarRef, terraformVarList, setTerraformVarList, setDeleteVariablesId, defaultScope } = useContext(VarsContext);

  const onDeleteRow = (row = {}) => {
    setDeleteVariablesId((preIds) => {
      if (row.id && preIds.indexOf(row.id) === -1) {
        return [ ...preIds, row.id ];
      } else {
        return preIds;
      }
    });
  };

  return (
    <Card
      title='Terraform变量'
    >
      <EditableTable
        getActionRef={ref => (terraformVarRef.current = ref.current)}
        defaultData={{ scope: defaultScope, sensitive: false, type: 'terraform' }}
        value={terraformVarList}
        fields={fields}
        onDeleteRow={onDeleteRow}
        addBtnText='添加全局变量'
        multiple={true}
        onChange={setTerraformVarList}
      />
    </Card>
  );
};

export default TerraformVarForm;
