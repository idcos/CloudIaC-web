import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
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
    maxLen,
    seniorSelectfooter = null,
    formatOptionLabel = (t) => t,
    options = []
  } = props || {};

  const [ showOptions, setShowOptions ] = useState([]);

  useEffect(() => {
    setShowOptions(options.slice(0, maxLen));
  }, [ maxLen, options ]);

  const onSearch = (keyword) => {
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
      onSearch={onSearch}
      placeholder={placeholder}
      showArrow={false} 
      showSearch={true}
      onChange={onChange}
      value={value}
      dropdownRender={menu => {
        const showFlattenOptions = intersectionWith(menu.props.flattenOptions, showOptions, (flattenOption, showOption) => {
          return flattenOption.key === showOption[valuePropName];
        });
        return (
          <div className={styles.seniorSelectList}>
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
              {name !== description && <div className='description idcos-text-ellipsis'>
                { description || '' }
              </div>}
            </Option>
          );
        })
      }
    </Select>
  );
};
