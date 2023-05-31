import React from 'react';
import { Tag, Tooltip } from 'antd';

import styles from './styles.less';

const EnvTags = ({ tags }) => {
  const data = tags ? tags.split(',') : [];

  return data && data.length ? (
    <div className={styles.tags}>
      {data.map((tag, index) => {
        return (
          <Tag closable={false}>
            <Tooltip title={tag}>
              <span className='tag-content'>{tag}</span>
            </Tooltip>
          </Tag>
        );
      })}
    </div>
  ) : (
    <div></div>
  );
};

export default EnvTags;
