import { Table, Tag, Input, Space, Checkbox, Button } from 'antd';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import { useEventListener } from 'ahooks';
import { SCOPE_ENUM } from './enum';

export default ({ scrollTableWrapperClassName, dataSource, defaultScope, readOnly = false, event$ }) => {

  const topSelector = `.top-dom.${scrollTableWrapperClassName} .ant-table-content`;
  const bottomSelector = `.bottom-dom.${scrollTableWrapperClassName} .ant-table-content`;
  const scrollHandler = (e, otherDomSelector) => {
    const otherDom = document.querySelector(otherDomSelector);
    if (otherDom) {
      otherDom.scrollLeft = e.target.scrollLeft;
    }
  };
  useEventListener('scroll', (e) => scrollHandler(e, bottomSelector), { target: () => document.querySelector(topSelector) || {} });
  useEventListener('scroll', (e) => scrollHandler(e, topSelector), { target: () => document.querySelector(bottomSelector) || {} });

  const columns = [
    {
      title: '来自',
      width: 118,
      dataIndex: 'objectType',
      render: (text) => {
        return (
          <Tag style={{ marginTop: 5 }}>{SCOPE_ENUM[text]}-资源账号</Tag>
        );
      }
    },
    {
      title: 'key',
      width: 254,
      render: (_, record) => {
        const { variables } = record;
        return (
          <Space size={5} direction='vertical' style={{ width: '100%' }}>
            {(variables || []).map(({ name }) => (
              <Input placeholder='请输入key' value={name} disabled={true}/>
            ))}
          </Space>
        );
      }
    },
    {
      title: 'value',
      width: 258,
      render: (_, record) => {
        const { variables } = record;
        return (
          <Space size={5} direction='vertical' style={{ width: '100%' }}>
            {(variables || []).map(({ value }) => (
              <Input placeholder='请输入value' value={value} disabled={true}/>
            ))}
          </Space>
        );
      }
    },
    {
      title: '描述信息',
      width: 260,
      render: (_, record) => {
        const { variables } = record;
        return (
          <Space size={5} direction='vertical' style={{ width: '100%' }}>
            {(variables || []).map(({ description }) => (
              <Input placeholder='请输入描述信息' value={description} disabled={true}/>
            ))}
          </Space>
        );
      }
    },
    {
      title: '是否敏感',
      width: 116,
      render: (_, record) => {
        const { variables } = record;
        return (
          <Space size={5} direction='vertical' style={{ width: '100%' }}>
            {(variables || []).map(({ sensitive }) => (
              <Checkbox disabled={true} checked={!!sensitive} style={{ padding: '5px 0' }}>敏感</Checkbox>
            ))}
          </Space>
        );
      }
    },
    ...(readOnly ? [] : [
      {
        title: '操作',
        width: 110,
        fixed: 'right',
        render: (_, record) => {
          const { objectType, varGroupId } = record;
          return (
            <Button 
              disabled={objectType !== defaultScope} 
              type='link' 
              style={{ padding: 0 }}
              onClick={() => event$.emit({ type: 'remove-resource-account', data: { varGroupIds: [varGroupId] } })}
            >删除</Button>
          );
        }
      }
    ])
  ];

  return (
    <Table 
      className={classnames('table-cell-vertical-top', 'bottom-dom', scrollTableWrapperClassName, { 'fn-hide-table-tbody': isEmpty(dataSource) })}
      showHeader={false}
      columns={columns} 
      dataSource={dataSource} 
      scroll={{ x: 'min-content' }}
      pagination={false}
    />
  );
};