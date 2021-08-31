import React, { useState } from 'react';
import { Transfer, Switch, Table, Tag } from 'antd';
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
      disabled: listDisabled
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection = {
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
        selectedRowKeys: listSelectedKeys
      };

      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size='small'
          pagination={false}
          style={{ pointerEvents: listDisabled ? 'none' : null }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) {
                return; 
              }
              onItemSelect(key, !listSelectedKeys.includes(key));
            }
          })}
        />
      );
    }}
  </Transfer>
);

// dataScourt 数据需要转换成
// {
//   key: '',
//   name: '',
//   email: ''
// }

const Index = ({ leftTableColumns, rightTableColumns, onChange, dataScourt, value, ...propsDemo }) => {
  const [ targetKeys, setTargetKeys ] = useState(value || []);
  return (
    <>
      <TableTransfer
        listStyle={{
          height: 420
        }}
        dataSource={dataScourt || []}
        targetKeys={targetKeys}
        showSearch={true}
        onChange={(nextTargetKeys) => {
          onChange(nextTargetKeys); 
          setTargetKeys(nextTargetKeys);
        }}
        filterOption={(inputValue, item) =>
          item.name.indexOf(inputValue) !== -1 
        }
        locale={{ itemUnit: '已选', itemsUnit: '未选', searchPlaceholder: '请输入姓名搜索' }}
        leftColumns={leftTableColumns}
        rightColumns={rightTableColumns}
      />
    </>
  );
};

export default Index;