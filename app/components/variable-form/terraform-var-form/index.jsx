import React, { useContext, useRef, useEffect, useState } from 'react';
import { Card, Input, Checkbox, Tag, notification, Button } from 'antd';
import isEqual from 'lodash/isEqual';

import EditableTable from 'components/Editable';
import tplAPI from 'services/tpl';

import ImportVarsModal from '../components/import-vars-modal';
import VarsContext from '../context';
import { SCOPE_ENUM } from '../enum';

const TerraformVarForm = () => {

  const { 
    terraformVarRef, 
    terraformVarList, 
    setTerraformVarList, 
    setDeleteVariablesId, 
    defaultScope, 
    defalutTerraformVarList,
    fetchParams,
    canImportTerraformVar
  } = useContext(VarsContext);

  const defalutTerraformVarListRef = useRef([]);
  const [ importVars, setImportVars ] = useState([]);
  const [ importModalVisible, setImportModalVisible ] = useState(false);

  useEffect(() => {
    defalutTerraformVarListRef.current = defalutTerraformVarList;
  }, [defalutTerraformVarList]);

  useEffect(() => {
    if (canImportTerraformVar && fetchParams) {
      fetchImportVars();
    }
  }, [ fetchParams, canImportTerraformVar ]);

  const fetchImportVars = async () => {
    const { orgId, repoRevision, repoId, repoType, vcsId } = fetchParams;
    const params = { orgId, repoRevision, repoId, repoType, vcsId };
    try {
      const res = await tplAPI.listImportVars(params);
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setImportVars(res.result || []);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
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
      id: 'overwrites',
      editable: true,
      column: {
        className: 'fn-hide'
      }
    },
    {
      title: '来自',
      id: 'scope',
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
        const { scope, overwrites } = record;
        return <Input placeholder='请输入name' disabled={scope !== defaultScope || overwrites} />;
      },
      formItemProps: {
        rules: [
          { required: true, message: '请输入name' },
          (form) => ({
            validator(_, value) {
              const { id } = form.getFieldsValue();
              const list = terraformVarList.filter(it => it.id !== id);
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
        dependencies: [ 'sensitive', 'description' ],
        rules: [
          (form) => ({
            validator(_, value) {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  const { sensitive, id } = form.getFieldsValue();
                  if (!(sensitive && id) && !value) {
                    reject(new Error('请输入value'));
                  }
                  resolve();
                }, 300);
              });
            }
          })
        ]
      },
      renderFormInput: (record, { value, onChange }, form) => {
        const { id, sensitive } = record;
        return sensitive ? (
          <Input.Password
            autoComplete='new-password'
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
        return <Checkbox checked={!!value} onChange={e => {
          if (onChange) {
            onChange(e.target.checked);
          }
        }}
        />;
      }
    }
  ];

  const optionRender = (record, optionNodes) => {
    const { scope } = record;
    const DeleteBtn = React.cloneElement(optionNodes.delete, { buttonProps: { disabled: scope !== defaultScope } });
    return (
      DeleteBtn
    );
  };

  const onDeleteRow = ({ row, rows, k, handleChange }) => {
    setDeleteVariablesId((preIds) => {
      if (row.id && preIds.indexOf(row.id) === -1) {
        return [ ...preIds, row.id ];
      } else {
        return preIds;
      }
    });
    const { overwrites, editable_id, _key_id } = row;
    if (overwrites) {
      handleChange(
        rows.map((item) => {
          if (item.editable_id === k) {
            return { ...overwrites, editable_id, _key_id };
          }
          return item;
        })
      );
    } else {
      handleChange(
        rows.filter((item) => item.editable_id !== k)
      );
    }
  };

  const onChangeEditableTable = (list) => {
    list = list.map(it => {
      // 如来源不同 则对比数据
      let findIt = defalutTerraformVarListRef.current.find(v => v.name === it.name);
      if (!findIt) {
        return it;
      }
      const oldIt = findIt.scope !== defaultScope ? findIt : findIt.overwrites;
      if (!oldIt) {
        return it;
      }
      const pickFindIt = {
        value: oldIt.value || '',
        description: oldIt.description || '',
        sensitive: !!oldIt.sensitive
      };
      const pickIt = {
        value: it.value || '',
        description: it.description || '',
        sensitive: !!it.sensitive
      };
      // 数据不同 则来源置为默认来源 反之就恢复默认数据
      if (!isEqual(pickFindIt, pickIt)) {
        it.scope = defaultScope;
        delete it.id;
        if (!it.overwrites) {
          it.overwrites = oldIt;
        }
      } else {
        it = { ...it, ...oldIt };
      }
      return it;
    });
    setTerraformVarList(list);
  };

  const onImportFinish = (params, cb) => {
    setTerraformVarList((preList) => [ ...preList, ...params ]);
    cb && cb();
  };

  return (
    <Card
      title='Terraform变量'
      extra={
        canImportTerraformVar ? (
          <Button type='primary' onClick={() => setImportModalVisible(true)}>导入</Button>
        ) : null
      }
    >
      <EditableTable
        getActionRef={ref => (terraformVarRef.current = ref.current)}
        defaultData={{ scope: defaultScope, sensitive: false, type: 'terraform' }}
        value={terraformVarList}
        fields={fields}
        onDeleteRow={onDeleteRow}
        addBtnText='添加全局变量'
        multiple={true}
        onChange={onChangeEditableTable}
        optionRender={optionRender}
      />
      <ImportVarsModal 
        importVars={importVars} 
        visible={importModalVisible} 
        terraformVarList={terraformVarList}
        onClose={() => setImportModalVisible(false)}
        defaultScope={defaultScope}
        onFinish={onImportFinish}
      />
    </Card>
  );
};

export default TerraformVarForm;
