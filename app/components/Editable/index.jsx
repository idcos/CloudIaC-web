
import React, {
  useContext,
  useMemo,
  useRef,
  useCallback,
  useEffect,
  useState
} from 'react';

import pick from 'lodash/pick';
import has from 'lodash/has';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import assign from 'lodash/assign';
import isObject from 'lodash/isObject';
import concat from 'lodash/concat';
import { Table, Button, Space } from 'antd';
import { t } from 'utils/i18n';
import { EditableContext } from './context';
import { useEditableState, useValidateObservers } from './hooks';
import EditableRow from './EditableRow';
import EditableCell from './EditableCell';
import {
  OptionDelete,
  OptionEdit,
  OptionCancel,
  OptionSave,
  OptionSequence
} from './options';
import styles from './styles.less';

const EditableTable = (props) => {
  const {
    tableProps,
    fields,
    defaultValue,
    value,
    onChange,
    defaultData,
    getActionRef,
    hideAddBtn = false,
    addBtnProps,
    addBtnText,
    max,
    onRowValuesChange,
    optionExtraBefore,
    optionExtraAfter,
    optionSpaceProps,
    optionRender,
    multiple: mult = true,
    sortMode = false,
    onDeleteRow, // eslint-disable-line
    footer,
    readOnly = false
  } = props;

  const {
    addValidateFun,
    removeValidateFun,
    notifyObservers
  } = useValidateObservers();

  // 多行编辑和单行编辑不支持动态切换，因为切换之后有问题，后期可能会支持动态切换；
  const [multiple] = useState(mult);
  const fieldNamesRef = useRef([]);
  const actionRef = useRef({
    setRowsData: () => {}, // eslint-disable-line
    handleAdd: () => {}, // eslint-disable-line
    handleDelete: () => {}, // eslint-disable-line
    handleEdit: () => {}, // eslint-disable-line
    handleValidate: notifyObservers
  });

  // 区分设置value为undefined和未设置值的情况
  const {
    state,
    handleAdd,
    setRowsData,
    handleDelete,
    handleEdit,
    move,
    settingId,
    isSetting,
    sequenceId,
    setSequenceId,
    errorMap,
    addErrorMapItem,
    removeErrorMapItem
  } = useEditableState({
    value: has(props, 'value') && !value ? [] : value,
    defaultValue,
    defaultData,
    onChange,
    onDeleteRow,
    max
  });
  const showAddBtn = !hideAddBtn && (!max || max > state.length);

  useEffect(() => {
    assign(actionRef.current, {
      handleAdd,
      setRowsData,
      handleDelete,
      handleEdit
    });
  }, [ handleAdd, setRowsData ]);

  useEffect(() => {
    if (isFunction(getActionRef)) {
      getActionRef(actionRef); 
    }
  }, []);

  const getColumnByField = useCallback(col => {
    const tableColumn = {
      title: col.title,
      dataIndex: col.id,
      ...(col && col.column),
      children: isArray(col && col.children)
        ? col.children.map(getColumnByField)
        : undefined
    };
    if (!col.editable) {
      tableColumn;
    } else {
      const formItemProps = {
        name: col.id,
        ...col.formItemProps
      };
      // 可编辑单元格存储表单name字段；
      if (fieldNamesRef.current.indexOf(formItemProps.name) === -1) {
        fieldNamesRef.current.push(formItemProps.name);
      }
      tableColumn.onCell = (record, rowIndex) => ({
        record,
        ...pick(col, [
          'editable',
          'title',
          'renderFormInput',
          'formFieldProps',
          'trigger'
        ]),
        formItemProps,
        rowIndex,
        handleSave: () => {}, // eslint-disable-line
        setRowsData
      });
    }
    return tableColumn;
  }, []);

  // 只在初始化的时候生成一次columns配置，暂不支持动态更新columns配置
  // 注：如果后面需要支持动态更新columns,注意fieldNames的更新；
  const columns = useMemo(() => {
    const list = fields.map(getColumnByField);
    if (!readOnly) {
      list.push({
        title: t('define.action'),
        width: 110,
        fixed: 'right',
        render: (_, row) => {
          let optionsNode = [
            <OptionSave
              key='option_save'
              id={row.editable_id}
              buttonProps={props.saveBtnProps}
              buttonText={props.saveBtnText}
            />,
            <OptionEdit
              key='option_edit'
              id={row.editable_id}
              buttonProps={props.editBtnProps}
              buttonText={props.editBtnText}
            />,
            <OptionDelete
              key='option_delete'
              id={row.editable_id}
              buttonProps={props.deleteBtnProps}
              buttonText={props.deleteBtnText}
            />,
            <OptionCancel
              key='option_cancel'
              id={row.editable_id}
              buttonProps={props.cancelBtnProps}
              buttonText={props.cancelBtnText}
            />
          ];
          if (isFunction(optionRender)) {
            return optionRender(row, {
              delete: optionsNode[2],
              edit: optionsNode[1],
              cancel: optionsNode[3],
              save: optionsNode[0]
            });
          }
          if (isFunction(optionExtraBefore)) {
            optionsNode = concat(optionExtraBefore(row), optionsNode);
          } else if (optionExtraBefore) {
            optionsNode = concat([], optionExtraBefore, optionsNode);
          }
          if (isFunction(optionExtraAfter)) {
            optionsNode = concat(optionsNode, optionExtraAfter(row));
          } else if (optionExtraAfter) {
            optionsNode = concat(optionsNode, optionExtraAfter);
          }
          if (optionsNode.length > 1 && optionSpaceProps !== false) {
            return (
              <Space
                direction='horizontal'
                {...(isObject(optionSpaceProps) ? optionSpaceProps : {})}
              >
                {optionsNode}
              </Space>
            );
          }
          return optionsNode;
        }
      });
    }
    // 气泡排序
    if (sortMode === 'popover') {
      list.unshift({
        dataIndex: '_index',
        title: '序号',
        width: 80,
        render: (_, record, index) => {
          return <OptionSequence id={record.editable_id} rowIndex={index} />;
        }
      });
    }
    return list;
  }, [ sortMode, fields, multiple ]);

  return (
    <EditableContext.Provider
      value={{
        fieldNames: fieldNamesRef.current,
        setRowsData,
        handleDelete,
        handleEdit,
        move,
        settingId,
        multiple,
        isSetting,
        state,
        setSequenceId,
        sequenceId,
        errorMap,
        addErrorMapItem,
        removeErrorMapItem
      }}
    >
      <div className={styles.editableTable}>
        <Table
          {...tableProps}
          scroll={{ x: 'min-content' }}
          tableLayout='fixed'
          pagination={false}
          rowKey='_key_id'
          components={{
            body: {
              row: EditableRow,
              cell: EditableCell
            }
          }}
          dataSource={state}
          columns={columns}
          onRow={(record, index) => {
            return {
              record,
              index,
              onRowValuesChange,
              addValidateFun,
              removeValidateFun
            };
          }}
        />
        {showAddBtn && !footer && (
          <Button
            block={true}
            type='dashed'
            disabled={!multiple && isSetting}
            {...addBtnProps}
            style={{
              marginBottom: 16,
              marginTop: 16,
              ...(addBtnProps && addBtnProps.style)
            }}
            onClick={e => {
              if (isFunction(addBtnProps && addBtnProps.onClick)) {
                addBtnProps.onClick(e);
              }
              handleAdd();
            }}
          >
            {addBtnText || '添加一行'}
          </Button>
        )}
        {footer}
      </div>
    </EditableContext.Provider>
  );
};

export default EditableTable;
