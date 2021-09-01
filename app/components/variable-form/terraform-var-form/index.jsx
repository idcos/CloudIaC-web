import React, { useContext, useRef, useEffect, useState } from 'react';
import { Collapse, Input, Checkbox, Tag, notification, Button, Space } from 'antd';
import styled from 'styled-components';
import isEqual from 'lodash/isEqual';
import EditableTable from 'components/Editable';
import tplAPI from 'services/tpl';
import ImportVarsModal from '../components/import-vars-modal';
import VarsContext from '../context';
import { SCOPE_ENUM } from '../enum';

const EditableTableFooter = styled.div`
  margin-top: 16px;
  text-align: right;
`;

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
  const terraformVarDataRef = useRef(terraformVarList);
  const [ importVars, setImportVars ] = useState([]);
  const [ importModalVisible, setImportModalVisible ] = useState(false);

  useEffect(() => {
    terraformVarDataRef.current = terraformVarList;
  }, [terraformVarList]);

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
      renderFormInput: (record) => {
        const { overwrites } = record;
        return <Input placeholder='请输入name' disabled={overwrites} />;
      },
      formItemProps: {
        rules: [
          { required: true, message: '请输入name' },
          {
            validator(_, value) {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  const sameList = (terraformVarDataRef.current || []).filter(it => it.name === value);
                  if (value && sameList.length > 1) {
                    reject(new Error('name值不允许重复!'));
                  }
                  resolve();
                }, 300);
              });
            }
          }
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
    const DeleteBtn = React.cloneElement(optionNodes.delete, { 
      buttonProps: { disabled: scope !== defaultScope, type: 'link' } 
    });
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
            return { ...overwrites, editable_id, _key_id, overwrites };
          }
          return item;
        })
      );
    } else {
      handleChange(
        rows.filter((item) => item.editable_id !== k)
      );
    }
    terraformVarRef.current.handleValidate();
  };

  const onChangeEditableTable = (list) => {
    list = list.map(it => {
      if (it.isNew) { // 全新数据,不处理
        return it;
      }
      // 如来源不同 则对比数据
      const sameNameData = defalutTerraformVarListRef.current.find(v => v.name === it.name);
      if (!sameNameData) { // 修改名称的数据
        return it;
      }
      if (sameNameData.scope === defaultScope && it.scope === defaultScope && it.id) { // 旧的同域数据,不处理
        return it;
      }
      const parentSameNameData = sameNameData.scope !== defaultScope ? sameNameData : sameNameData.overwrites;
      if (!parentSameNameData) { // 没有同名的继承数据，不处理
        return it;
      }
      const pickFindIt = {
        value: parentSameNameData.value || '',
        description: parentSameNameData.description || '',
        sensitive: !!parentSameNameData.sensitive
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
      } else {
        it = { ...it, ...parentSameNameData };
      }
      return it;
    });
    setTerraformVarList(list);
  };

  const onImportFinish = (params, cb) => {
    setTerraformVarList((preList) => [ ...preList, ...params ]);
    cb && cb();
  };

  const pushVar = (isSelectType) => {
    setTerraformVarList((preList) => [ 
      ...preList, {
        scope: defaultScope, 
        sensitive: false, 
        type: 'terraform', 
        isNew: true,
        isSelectType
      } 
    ]);
  };

  return (
    <Collapse expandIconPosition={'right'}>
      <Collapse.Panel header='Terraform变量' forceRender={true}>
        <EditableTable
          getActionRef={ref => (terraformVarRef.current = ref.current)}
          defaultData={{ scope: defaultScope, sensitive: false, type: 'terraform', isNew: true }}
          value={terraformVarList}
          fields={fields}
          onDeleteRow={onDeleteRow}
          deleteBtnProps={{ type: 'link' }}
          addBtnText='添加全局变量'
          footer={
            <EditableTableFooter>
              <Space>
                {
                  canImportTerraformVar ? (
                    <Button onClick={() => setImportModalVisible(true)}>导入</Button>
                  ) : null
                }
                <Button onClick={() => pushVar()}>添加普通变量</Button>
                <Button onClick={() => pushVar(true)}>添加选择型变量</Button>
              </Space>
            </EditableTableFooter>
          }
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
      </Collapse.Panel>
    </Collapse>
  );
};

export default TerraformVarForm;
