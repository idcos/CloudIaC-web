import React, { useState, useMemo } from 'react';

import { Menu, Dropdown } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

import styles from './styles.less';

const emptyFn = () => { /** emptyFn */ };

export default (props) => {

  const {
    style = {},
    selectionStyle = {},
    options = [],
    lablePropName = 'lable',
    valuePropName = 'value',
    value = undefined,
    menuSelectfooter,
    onChange = emptyFn
  } = props || {};

  const [ optionVisible, setOptionVisible ] = useState(false);

  const menu = useMemo(() => {
    return (
      <div className={styles.menuSelectList}>
        <div className='menu-select-body'>
          <Menu 
            selectedKeys={[value]} 
            onClick={({ key }) => onChange(key)}
          >
            {
              options.map((it) => <Menu.Item key={it[valuePropName]}>{it[lablePropName]}</Menu.Item>)
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
  }, [ options, value, valuePropName, lablePropName ]);

  const label = useMemo(() => {
    const data = options.find(it => it[valuePropName] === value) || {};
    return data[lablePropName];
  }, [ options, value, valuePropName, lablePropName ]);

  return (
    <div className={styles.menuSelect} style={style}>
      <Dropdown overlay={menu} trigger={['click']} visible={optionVisible} onVisibleChange={setOptionVisible}>
        <div className='selection' style={selectionStyle}>
          <div className={`label ${optionVisible ? 'selecting' : ''}`}>{label}</div>
          <div className='icon'>
            { optionVisible ? <DownOutlined /> : <RightOutlined /> }
          </div>
        </div>
      </Dropdown>
    </div>
    
  );
};
