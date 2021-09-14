import React, { useState, useEffect } from 'react';
import { Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import noop from 'lodash/noop';
import intersectionWith from 'lodash/intersectionWith';
import styles from './styles.less';

const { Option } = Select;

export default (props) => {

  const {
    placeholder = '请选择',
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
    showSearch = true,
    searchPlaceholder = '请输入关键词搜索',
    maxLen,
    seniorSelectfooter = null,
    formatOptionLabel = (t) => t,
    options = []
  } = props || {};

  const [ showOptions, setShowOptions ] = useState([]);

  useEffect(() => {
    setShowOptions(options.slice(0, maxLen));
  }, [ maxLen, options ]);

  const onSearch = (e) => {
    const keyword = e.target.value;
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
      onChange={onChange}
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
                  <Input placeholder={searchPlaceholder} suffix={<SearchOutlined />} onChange={onSearch} />
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
          const { [lablePropsNames.name]: name, [valuePropName]: value, [lablePropsNames.description]: description, disabled } = option;
          return (
            <Option 
              {
                ...{
                  [lablePropsNames.name]: formatOptionLabel(name)
                }
              }
              value={value} 
              disabled={disabled}
            >
              <div className='name idcos-text-ellipsis'>
                { name }
              </div>
              {
                description && (
                  <div className='description idcos-text-ellipsis'>
                    { description || '' }
                  </div>
                )
              }
            </Option>
          );
        })
      }
    </Select>
  );
};
