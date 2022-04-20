import React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
import styles from './styles.less';

export default ({ menus = [], activeKey, onChange = noop, className = '', ...props }) => {

  return (
    <div className={classNames(styles.menus, className)} {...props}>
      {menus.map(menu => {
        const { type, name, key, icon, title, disabled } = menu;
        if (type === 'title') {
          return (
            <div className='menu-title'>{title}</div>
          );
        }
        return (
          <div 
            className={classNames('menu-item', { active: key === activeKey })}
            onClick={() => {
              if (key !== activeKey && !disabled) {
                onChange(key);
              }
            }}
          >
            {icon && <div className='menu-item-icon'>{icon}</div>}
            <div className='menu-item-name'>{name}</div>
          </div>
        );
      })}
    </div>
  );
};