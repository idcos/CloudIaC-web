import React, { useRef, useEffect, useState } from 'react';
import { Collapse, Select, Input, Divider, Checkbox, Tag, notification, Button, Space } from 'antd';
import styled from 'styled-components';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import EditableTable from 'components/Editable';
import tplAPI from 'services/tpl';
import ImportVarsModal from './import-vars-modal';
import { SCOPE_ENUM, VAR_TYPE_ENUM } from '../enum';

const EditableTableFooter = styled.div`
  margin-top: 16px;
  text-align: right;
`;

const OptionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SelectTypeValue = ({
  inputOptions,
  placeholder,
  value,
  onChange,
  isSameScope,
  form
}) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState();

  useEffect(() => {
    if (!isEmpty(inputOptions)) {
      setOptions(inputOptions)
    }
  }, [inputOptions]);

  const addOption = () => {
    const newOptions = [...options, inputValue];
    setOptions(newOptions);
    setInputValue();
    form.setFieldsValue({ options: newOptions });
  };

  const delOption = (e, option) => {
    e.stopPropagation();
    if (option === value) {
      onChange();
    }
    const newOptions = options.filter(item => item !== option);
    setOptions(newOptions);
    form.setFieldsValue({ options: newOptions });
  };

  return (
    <Select
      value={value}
      getPopupContainer={triggerNode => triggerNode.parentNode}
      optionLabelProp='value'
      onChange={onChange}
      placeholder={placeholder}
      style={{ width: '100%' }}
      allowClear={true}
      dropdownRender={menu => (
        <div>
          {menu}
          {
            isSameScope && (
              <>
                <Divider style={{ margin: '4px 0' }} />
                <Space style={{ padding: 8 }}>
                  <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                  <Button
                    type='link'
                    style={{ padding: 0 }}
                    disabled={!inputValue || options.includes(inputValue)}
                    onClick={addOption}
                  >
                    添加
                  </Button>
                </Space>
              </>
            )
          }
        </div>
      )}
    >
      {
        options.map(item => (
          <Select.Option key={item} value={item}>
            <OptionWrapper>
              <span>{item}</span>
              {isSameScope && <Button type='link' style={{ padding: 0 }} onClick={(e) => delOption(e, item)}>删除</Button>}
            </OptionWrapper>
          </Select.Option>
        ))
      }
    </Select>
  );
};

const VarFormTable = (props) => {

  const {
    formVarRef,
    varList,
    setVarList,
    setDeleteVariablesId,
    defaultScope,
    defalutVarList,
    fetchParams,
    canImportVar,
    type
  } = props;
  const defalutVarListRef = useRef([]);
  const varDataRef = useRef(varList);
  const [importVars, setImportVars] = useState([]);
  const [importModalVisible, setImportModalVisible] = useState(false);

  useEffect(() => {
    varDataRef.current = varList;
  }, [varList]);

  useEffect(() => {
    defalutVarListRef.current = defalutVarList;
  }, [defalutVarList]);

  useEffect(() => {
    if (canImportVar && fetchParams) {
      fetchImportVars();
    }
  }, [fetchParams, canImportVar]);

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
      id: 'options',
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
                  const sameList = (varDataRef.current || []).filter(it => it.name === value);
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
        dependencies: ['sensitive', 'description'],
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
        const { id, sensitive, options, scope } = record;
        if (sensitive) {
          return (
            <Input.Password
              autoComplete='new-password'
              placeholder={id ? '空值保存时不会修改原有值' : '请输入value'}
              visibilityToggle={false}
            />
          );
        } else {
          return (
            isArray(options) ? (
              <SelectTypeValue
                form={form}
                inputOptions={options}
                isSameScope={scope === defaultScope}
                value={value}
                onChange={onChange}
                placeholder='请选择value'
              />
            ) : (
              <Input placeholder='请输入value' />
            )
          );
        }
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
      renderFormInput: (record, { value, onChange }) => {
        const { options } = record;
        return (
          <Checkbox
            disabled={isArray(options)}
            checked={!!value}
            onChange={e => {
              if (onChange) {
                onChange(e.target.checked);
              }
            }}
          >
            敏感
          </Checkbox>
        );
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
        return [...preIds, row.id];
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
    formVarRef.current.handleValidate();
  };

  const onChangeEditableTable = (list) => {
    list = list.map(it => {
      if (it.isNew) { // 全新数据,不处理
        return it;
      }
      // 如来源不同 则对比数据
      const sameNameData = defalutVarListRef.current.find(v => v.name === it.name);
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
    setVarList(list);
  };

  const onImportFinish = (params, cb) => {
    setVarList((preList) => [...preList, ...params]);
    cb && cb();
  };

  const pushVar = (isSelectType) => {
    setVarList((preList) => [
      ...preList, {
        scope: defaultScope,
        sensitive: false,
        type,
        isNew: true,
        options: isSelectType ? [] : null // 选择型变量options为数组 普通型变量options始终为null
      }
    ]);
  };

  return (
    <Collapse expandIconPosition={'right'}>
      <Collapse.Panel header={VAR_TYPE_ENUM[type]} forceRender={true}>
        <EditableTable
          getActionRef={ref => (formVarRef.current = ref.current)}
          defaultData={{ scope: defaultScope, sensitive: false, type, isNew: true }}
          value={varList}
          fields={fields}
          onDeleteRow={onDeleteRow}
          deleteBtnProps={{ type: 'link' }}
          addBtnText='添加全局变量'
          footer={
            <EditableTableFooter>
              <Space>
                {
                  canImportVar ? (
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
          varList={varList}
          onClose={() => setImportModalVisible(false)}
          defaultScope={defaultScope}
          onFinish={onImportFinish}
        />
      </Collapse.Panel>
    </Collapse>
  );
};

export default VarFormTable;
