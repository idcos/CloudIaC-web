import React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import styles from './styles.less';

export default ({ options = [], value, onChange = noop }) => {

  return (
    <div className={styles.radioButtonGroup}>
      {options.map((opt) => {
        return (
          <div 
            className={classNames('radio-button', { active: opt.value === value, disabled: opt.disabled })}
            onClick={() => {
              if (opt.value !== value && !opt.disabled) {
                onChange(opt.value);
              }
            }}
          >
            {opt.label}
          </div>
        );
      })}
    </div>
  );
};