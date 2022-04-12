import { Table, Tag, Input, Space, Checkbox, Button } from 'antd';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import { useEventListener } from 'ahooks';
import { SCOPE_ENUM } from 'constants/types';
import { t } from 'utils/i18n';

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
      title: t('define.variable.objectType'),
      width: 200,
      dataIndex: 'objectType',
      render: (text) => {
        return (
          <div style={{ width: 110 }}>
            <Tag style={{ marginTop: 5, marginRight: 0 }}>{SCOPE_ENUM[text]}-{t('define.resourceAccount.title')}</Tag>
          </div>
        );
      }
    },
    {
      title: 'key',
      width: 200,
      render: (_, record) => {
        const { variables } = record;
        return (
          <Space size={5} direction='vertical' style={{ width: '100%' }}>
            {(variables || []).map(({ name }) => (
              <Input placeholder={t('define.form.input.placeholder')} value={name} disabled={true}/>
            ))}
          </Space>
        );
      }
    },
    {
      title: 'value',
      width: 210,
      render: (_, record) => {
        const { variables } = record;
        return (
          <Space size={5} direction='vertical' style={{ width: '100%' }}>
            {(variables || []).map(({ value, sensitive }) => (
              <Input placeholder={sensitive ? t('define.emptyValueSave.placeholder') : t('define.form.input.placeholder')} value={readOnly ? '******' : value} disabled={true}/>
            ))}
          </Space>
        );
      }
    },
    {
      title: t('define.des'),
      width: 260,
      render: (_, record) => {
        const { variables } = record;
        return (
          <Space size={5} direction='vertical' style={{ width: '100%' }}>
            {(variables || []).map(({ description }) => (
              <Input placeholder={t('define.form.input.placeholder')} value={description} disabled={true}/>
            ))}
          </Space>
        );
      }
    },
    {
      title: t('define.variable.isSensitive'),
      width: 116,
      render: (_, record) => {
        const { variables } = record;
        return (
          <Space size={5} direction='vertical' style={{ width: '100%' }}>
            {(variables || []).map(({ sensitive }) => (
              <Checkbox disabled={true} checked={!!sensitive} style={{ padding: '5px 0' }}>{t('define.variable.isSensitive')}</Checkbox>
            ))}
          </Space>
        );
      }
    },
    ...(readOnly ? [] : [
      {
        title: t('define.action'),
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
            >{t('define.action.delete')}</Button>
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