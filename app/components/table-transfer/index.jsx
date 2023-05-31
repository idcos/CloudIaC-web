import React, { useState, useEffect } from 'react';
import { Transfer, Table } from 'antd';
import difference from 'lodash/difference';

// Customize Table Transfer
const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer {...restProps}>
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection = {
        columnWidth: 26,
        getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          scroll={{ y: 300 }}
          dataSource={filteredItems}
          size='small'
          pagination={false}
          style={{
            pointerEvents: listDisabled ? 'none' : null,
            minHeight: 335,
          }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) {
                return;
              }
              onItemSelect(key, !listSelectedKeys.includes(key));
            },
          })}
        />
      );
    }}
  </Transfer>
);

const Index = ({
  leftTableColumns,
  rightTableColumns,
  onChange,
  dataScourt,
  value,
  locale,
  ...propsDemo
}) => {
  const [targetKeys, setTargetKeys] = useState(value || []);

  useEffect(() => {
    setTargetKeys(value || []);
  }, [value]);

  return (
    <>
      <TableTransfer
        dataSource={dataScourt || []}
        targetKeys={targetKeys}
        showSearch={true}
        onChange={nextTargetKeys => {
          onChange(nextTargetKeys);
          setTargetKeys(nextTargetKeys);
        }}
        filterOption={(inputValue, item) =>
          item.name.indexOf(inputValue) !== -1
        }
        locale={locale}
        leftColumns={leftTableColumns}
        rightColumns={rightTableColumns}
      />
    </>
  );
};

export default Index;
