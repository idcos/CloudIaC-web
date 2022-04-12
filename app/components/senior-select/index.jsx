import React, { useState, useEffect } from 'react';
import { Input, Select } from 'antd';
import { SearchOutlined, CheckOutlined } from '@ant-design/icons';
import noop from 'lodash/noop';
import intersectionWith from 'lodash/intersectionWith';
import { t } from 'utils/i18n';
import styles from './styles.less';

const { Option } = Select;

export default (props) => {

  const {
    placeholder = t('define.form.select.placeholder'),
    style = {},
    onChange = noop,
    lablePropsNames = {
      name: 'name',
      description: 'description'
    },
    searchKey = lablePropsNames.name,
    valuePropName = 'value',
    value,
    listHeight,
    showSearch = false,
    searchPlaceholder = '',
    maxLen,
    seniorSelectfooter = null,
    formatOptionLabel = (t) => t,
    options = []
  } = props || {};

  const [ showOptions, setShowOptions ] = useState([]);
  const [ searchValue, setSearchValue ] = useState('');

  useEffect(() => {
    setShowOptions(options.slice(0, maxLen));
  }, [ maxLen, options ]);

  const onSearch = (e) => {
    const keyword = e.target.value;
    setSearchValue(keyword);
    const reg = new RegExp(keyword, 'gi');
    const filterOptions = options.filter((it) => !keyword || reg.test(it[searchKey]));
    setShowOptions(filterOptions.slice(0, maxLen));
  };

  return (
    <Select
      className={styles.senior_select}
      getPopupContainer={triggerNode => triggerNode.parentNode}
      style={style} 
      listHeight={listHeight}
      optionLabelProp={lablePropsNames.name}
      filterOption={false}
      placeholder={placeholder}
      showArrow={false} 
      showSearch={false}
      onChange={(value) => {
        setSearchValue('');
        onChange(value);
      }}
      value={value}
      dropdownRender={menu => {
        const showFlattenOptions = intersectionWith(menu.props.flattenOptions, showOptions, (flattenOption, showOption) => {
          return flattenOption.key === showOption[valuePropName];
        });
        return (
          <div className={styles.seniorSelectList}>
            {
              showSearch && (
                <div className='senior-select-header'>
                  <Input value={searchValue} placeholder={searchPlaceholder} suffix={<SearchOutlined />} onChange={onSearch} />
                </div>
              )
            }
            {React.cloneElement(menu, { flattenOptions: showFlattenOptions })}
            {
              seniorSelectfooter ? (
                <div className='footer'>
                  {seniorSelectfooter}
                </div>
              ) : null
            }
          </div>
        );
      }}
    >
      {
        options.map((option) => {
          const { [lablePropsNames.name]: name, [valuePropName]: itemValue, disabled } = option;
          return (
            <Option 
              {
                ...{
                  [lablePropsNames.name]: formatOptionLabel(name)
                }
              }
              value={itemValue} 
              disabled={disabled}
            >
              <div className='content'>
                <span className='name idcos-text-ellipsis'>{name}</span>
                {
                  itemValue === value && <CheckOutlined className='selected-icon'/>
                }
              </div>
            </Option>
          );
        })
      }
    </Select>
  );
};
