import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import noop from 'lodash/noop';
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
    searchKey=lablePropsNames.name,
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
      dropdownRender={menu => (
        <div className={styles.seniorSelectList}>
          {menu}
          {
            seniorSelectfooter ? (
              <div className='footer'>
                {seniorSelectfooter}
              </div>
            ) : null
          }
        </div>
      )}
    >
      {
        showOptions.map((option) => {
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
              <div className='description idcos-text-ellipsis'>
                { description || '-' }
              </div>
            </Option>
          );
        })
      }
    </Select>
  );
};
