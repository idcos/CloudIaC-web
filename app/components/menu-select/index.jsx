import React, { useState, useMemo } from 'react';
import { Menu, Dropdown } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import noop from 'lodash/noop';

import styles from './styles.less';

export default (props) => {

  const {
    style = {},
    selectionStyle = {},
    options = [],
    lablePropsNames = {
      name: 'name',
      description: 'description'
    },
    valuePropName = 'value',
    value = undefined,
    menuSelectfooter,
    onChange = noop,
    setDividerVisible = noop
  } = props || {};

  const [ optionVisible, setOptionVisible ] = useState(false);

  const menu = useMemo(() => {
    const { name, description } = lablePropsNames;
    return (
      <div className={styles.menuSelectList}>
        <div className='menu-select-body'>
          <Menu 
            selectedKeys={[value]} 
            onClick={({ key }) => onChange(key)}
          >
            {
              options.map((it) => (
                <Menu.Item key={it[valuePropName]}>
                  <div className='name idcos-text-ellipsis'>
                    {it[name]}
                  </div>
                  <div className='description idcos-text-ellipsis'>
                    {it[description] || '-'}
                  </div>
                </Menu.Item>
              ))
            }
          </Menu>
        </div>
        {
          menuSelectfooter ? (
            <div className='menu-select-footer'>
              {menuSelectfooter}
            </div>
          ) : null
        }
      </div>
    );
  }, [ options, value, valuePropName, lablePropsNames ]);

  const name = useMemo(() => {
    const { name } = lablePropsNames;
    const data = options.find(it => it[valuePropName] === value) || {};
    return data[name];
  }, [ options, value, valuePropName, lablePropsNames ]);

  return (
    <div className={styles.menuSelect} style={style}>
      <Dropdown 
        overlay={menu} 
        trigger={['click']} 
        visible={optionVisible} 
        overlayStyle={{ width: '100%' }}
        onVisibleChange={(e) => {
          setOptionVisible(e); 
          setDividerVisible(e); 
        }}
        getPopupContainer={triggerNode => triggerNode.parentNode}
      >
        <div className='selection' style={selectionStyle}>
          <div className={`label fn-ellipsis ${optionVisible ? 'selecting' : ''}`}>
            {name}
          </div>
          <div className='icon'>
            { optionVisible ? <DownOutlined /> : <RightOutlined /> }
          </div>
        </div>
      </Dropdown>
    </div>
    
  );
};
