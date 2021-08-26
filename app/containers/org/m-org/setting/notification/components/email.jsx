import React from 'react';
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

const mockData = [];
for (let i = 0; i < 20; i++) {
  mockData.push({
    key: i.toString(),
    name: `content${i + 1}`,
    email: `description of content${i + 1}`
  });
}

const originTargetKeys = mockData.filter(item => +item.key % 2 == 0).map(item => item.key);

const leftTableColumns = [
  {
    dataIndex: 'name',
    title: '姓名'
  },
  {
    dataIndex: 'email',
    title: '邮箱'
  }
];
const rightTableColumns = [
  {
    dataIndex: 'name',
    title: '姓名'
  },
  {
    dataIndex: 'email',
    title: '邮箱'
  }
];

class Index extends React.Component {
  state = {
    targetKeys: originTargetKeys
  };

  onChange = nextTargetKeys => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  render() {
    const { targetKeys } = this.state;
    return (
      <>
        <TableTransfer
          listStyle={{
            height: 420
          }}
          dataSource={mockData}
          targetKeys={targetKeys}
          showSearch={true}
          onChange={this.onChange}
          filterOption={(inputValue, item) =>
            item.name.indexOf(inputValue) !== -1 
          }
          leftColumns={leftTableColumns}
          rightColumns={rightTableColumns}
        />
      </>
    );
  }
}

export default Index;