import React, { useContext, useRef, useEffect } from 'react';
import { Card, Input, Checkbox, Tag } from 'antd';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';

import EditableTable from 'components/Editable';

import VarsContext from '../context';
import { SCOPE_ENUM } from '../enum';

const EnvVarForm = () => {

  const { envVarRef, envVarList, setEnvVarList, setDeleteVariablesId, defaultScope, defalutEnvVarList } = useContext(VarsContext);

  const defalutEnvVarListRef = useRef([]);

  useEffect(() => {
    defalutEnvVarListRef.current = defalutEnvVarList;
  }, [defalutEnvVarList]);

  const onDeleteRow = (row = {}) => {
    setDeleteVariablesId((preIds) => {
      if (row.id && preIds.indexOf(row.id) === -1) {
        return [ ...preIds, row.id ];
      } else {
        return preIds;
      }
    });
  };

  const fields = [
    {
      id: 'id',
      editable: true,
      column: {
        className: 'fn-hide'
      }
    },
    {
      id: 'isDiffScope',
      editable: true,
      column: {
        className: 'fn-hide'
      }
    },
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
      renderFormInput: (record, { value, onChange }, form) => {
        const { isDiffScope } = record;
        return <Input placeholder='请输入name' disabled={isDiffScope} />;
      },
      formItemProps: {
        dependencies: ['id'],
        rules: [
          { required: true, message: '请输入name' },
          (form) => ({
            validator(_, value) {
              const { id } = form.getFieldsValue();
              const list = envVarList.filter(it => it.id !== id);
              if (!value || list.findIndex(it => it.name === value) === -1) {
                return Promise.resolve();
              } else {
                return Promise.reject(new Error('name值不允许重复!'));
              }
            }
          })
        ]
      }
    },
    {
      title: 'value',
      id: 'value',
      editable: true,
      formItemProps: {
        dependencies: [ 'sensitive', 'id' ],
        rules: [
          (form) => ({
            validator(_, value) {
              const { sensitive, id } = form.getFieldsValue();
              if (!(sensitive && id) && !value) {
                return Promise.reject(new Error('请输入value'));
              }
              return Promise.resolve();
            }
          })
        ]
      },
      renderFormInput: (record, { value, onChange }, form) => {
        const { id, sensitive } = record;
        return sensitive ? (
          <Input.Password
            placeholder={id ? '空值保存时不会修改原有值' : '请输入value'} // 编辑状态密文可留空
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
        const { isDiffScope } = record;
        return <Checkbox checked={!!value} disabled={isDiffScope} onChange={e => {
          if (onChange) {
            onChange(e.target.checked);
          }
        }}
        />;
      }
    }
  ];

  const optionRender = (record, optionNodes) => {
    const { isDiffScope } = record;
    const DeleteBtn = React.cloneElement(optionNodes.delete, { buttonProps: { disabled: isDiffScope } });
    return (
      DeleteBtn
    );
  };

  const onChangeEditableTable = (list) => {
    const pickKeys = [ 'value', 'description' ];
    list = list.map(it => {
      // 如来源不同 则对比数据
      if (it.isDiffScope) {
        const findIt = defalutEnvVarListRef.current.find(v => v.name === it.name);
        if (!findIt) {
          return;
        }
        const pickFindIt = pick(findIt, pickKeys);
        const pickIt = pick(it, pickKeys);
        if (!isEqual(pickFindIt, pickIt)) {
          it.scope = defaultScope;
          delete it.id;
        } else {
          it = { ...it, ...findIt };
        }
      }
      return it;
    });
    setEnvVarList(list);
  };

  return (
    <Card
      title='环境变量'
    >
      <EditableTable
        getActionRef={ref => (envVarRef.current = ref.current)}
        defaultData={{ scope: defaultScope, sensitive: false, type: 'environment' }}
        value={envVarList}
        fields={fields}
        addBtnText='添加全局变量'
        onDeleteRow={onDeleteRow}
        multiple={true}
        onChange={onChangeEditableTable}
        optionRender={optionRender}
      />
    </Card>
  );
};

export default EnvVarForm;
