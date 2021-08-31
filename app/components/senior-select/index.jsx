import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Divider, Select, Tooltip } from 'antd';
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
    valuePropName = 'value',
    value,
    seniorSelectfooter = null,
    formatOptionLabel = (t) => t,
    options = []
  } = props || {};

  return (
    <Select
      getPopupContainer={triggerNode => triggerNode.parentNode}
      style={style} 
      optionLabelProp={lablePropsNames.name}
      optionFilterProp={lablePropsNames.name}
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
